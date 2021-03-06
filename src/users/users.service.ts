import { BadRequestException, HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Repository } from 'typeorm';
import { subMinutes, subYears } from 'date-fns';
import * as fs from 'fs';

import * as uuid from 'uuid';
import * as Faker from 'faker';
import * as aws from 'aws-sdk';
import * as requestLib from 'request';
import * as Blob from 'cross-blob';

import { Search_Limit_Count, UserRole, UserState } from './enums';
import { UserEntity } from './entities/user.entity';
import { RegisterUserDto } from '../auth/dtos/register-user.dto';
import { getFromDto } from '../common/utils/repository.util';
import { NotificationType } from '../notification/enums';
import { UserSearchDto } from './dtos/userSearch.dto';
import { mailDomain, seedPassword } from '../seed/data/user.data';
import { FakerGenerateDto } from './dtos/faker-generate.dto';
import { S3_environment } from '../upload/enums';
import { map } from 'rxjs/operators';

const request = requestLib.defaults({ encoding: null });

aws.config.update({
  accessKeyId: S3_environment.ACCESS_KEY_ID,
  secretAccessKey: S3_environment.SECRET_ACCESS_KEY,
  region: S3_environment.AWS_REGION,
});
const s3 = new aws.S3();

@Injectable()
export class UsersService {
  URL_EXPIRATION_SECONDS = 300;

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private http: HttpService,
  ) {}

  async findByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOne({ email });
  }

  async findById(id: string): Promise<UserEntity> {
    return this.userRepository.findOne({
      relations: ['blockedList'],
      where: {
        id,
      },
    });
  }

  async removeById(id: string): Promise<boolean> {
    const customer = await this.findById(id);
    await this.userRepository.remove(customer);
    return true;
  }

  async getAnalyseInfo(id: string): Promise<UserEntity> {
    return this.userRepository.findOne({
      relations: ['sentChats'],
      where: {
        id,
      },
    });
  }

  async findNewUsers(): Promise<UserEntity[]> {
    const BeforeDate = (date: Date) => Between(subMinutes(date, 15), date);
    const res = await this.userRepository.find({
      where: {
        role: UserRole.Customer,
        createdAt: BeforeDate(new Date()),
      },
    });
    return res;
  }

  async findByRole(roleStr: UserRole): Promise<UserEntity[]> {
    return this.userRepository.find({
      role: roleStr,
    });
  }

  async findLikeRelationById(id: string): Promise<UserEntity> {
    return this.userRepository.findOne({
      relations: ['likedList'],
      where: {
        id,
      },
    });
  }

  async findBlockRelationById(id: string): Promise<UserEntity> {
    return this.userRepository.findOne({
      relations: ['blockedList'],
      where: {
        id,
      },
    });
  }

  async findVisitUsers(id: string): Promise<UserEntity[]> {
    const owner = await this.userRepository.findOne({
      relations: [
        'receiveNotifications',
        'receiveNotifications.sender',
        'receiveNotifications.receiver',
      ],
      where: { id },
    });
    const userIdList = [];
    const res = owner.receiveNotifications
      .filter((value) => value.pattern === NotificationType.Visit)
      .map((item) => {
        const sender = item.sender;
        sender.state = item.seen;
        return sender;
      })
      .filter((value, index, self) => {
        if (userIdList.indexOf(value.id) >= 0) {
          return false;
        } else {
          userIdList.push(value.id);
          return true;
        }
      });
    res.sort(function (a, b) {
      return a.state - b.state;
    });
    return res;
  }

  async findFavoriteRelationById(id: string): Promise<UserEntity> {
    return this.userRepository.findOne({
      relations: ['favoriteList'],
      where: { id },
    });
  }

  async addUser(dto: RegisterUserDto, throwErrors = true): Promise<UserEntity> {
    const found = await this.findByEmail(dto.email);
    if (found) {
      if (throwErrors) {
        throw new BadRequestException('Email is already used.');
      }
      return found;
    }
    const user = getFromDto<UserEntity>(dto, new UserEntity());
    user.role = UserRole.Customer;
    return this.userRepository.save(user);
  }

  async updateUser(user: UserEntity): Promise<UserEntity> {
    return this.userRepository.save(user);
  }

  async count(): Promise<number> {
    return this.userRepository.count();
  }

  async find(): Promise<UserEntity[]> {
    return this.userRepository.find({
      relations: ['categoryList'],
      order: {
        createdAt: 'DESC',
        state: UserState.NORMAL,
      },
    });
  }

  async userCreateAnalyze(): Promise<any[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .select('extract(year from user.createdAt)', 'year')
      .addSelect('Month(`createdAt`)', 'month')
      .addSelect('Count(*)', 'user_count')
      .groupBy('Year(`createdAt`)')
      .addGroupBy('Month(`createdAt`)')
      .getMany();
  }

  async findRandomUser(
    limit_count: string,
    idList: string[],
    searchKey: UserSearchDto,
  ): Promise<UserEntity[]> {
    if (searchKey.ignoreFlag) {
      return this.userRepository
        .createQueryBuilder()
        .where('id NOT IN (:...ids)', { ids: idList })
        .orderBy('random()')
        .limit(Number.parseInt(limit_count))
        .getMany();
    } else {
      limit_count = Search_Limit_Count;
      const curDate = new Date();
      const endYear = curDate.getFullYear() - searchKey.startAge;
      const startYear = curDate.getFullYear() - searchKey.endAge;
      const startDate = new Date(startYear, 0, 1);
      const endDate = new Date(endYear, 11, 31);
      return this.userRepository
        .createQueryBuilder()
        .where('id NOT IN (:...ids)', { ids: idList })
        .andWhere('gender like (:lookingFor)', {
          lookingFor: `${searchKey.lookingFor}`,
        })
        .andWhere('birthday >= (:startDate)', {
          startDate: startDate,
        })
        .andWhere('birthday <= (:endDate)', {
          endDate: endDate,
        })
        .andWhere('location like (:location)', {
          location: `%${searchKey.location}%`,
        })
        .orderBy('random()')
        .limit(Number.parseInt(limit_count))
        .getMany();
    }
  }

  async findUsersByIds(idList: string[]): Promise<UserEntity[]> {
    return this.userRepository.find({
      relations: ['blockedList'],
      where: { id: In(idList) },
    });
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.blockedList', 'blockedList')
      .where('id IN (:...ids)', { ids: idList })
      .getMany();
  }

  async addUserWithRole(
    role: UserRole,
    payload: FakerGenerateDto,
  ): Promise<UserEntity> {
    let res = null;
    const nameArray = payload.nameList.split('\n');
    const locationArray = payload.location.split('\n');

    for (let index = 0; index < payload.count; index++) {
      const firstName = Faker.name.firstName();
      const lastName = Faker.name.lastName();
      let fullName = `${firstName} ${lastName}`;
      if (payload.nameList !== '') {
        fullName = nameArray[index % nameArray.length];
      }
      const user = await this.addUser({
        fullName: fullName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${mailDomain}`,
        password: seedPassword,
        gender: Faker.random.arrayElement(['Woman', 'Man']),
      });
      user.role = role;
      const startDate = subYears(new Date(), payload.endAge);
      const endDate = subYears(new Date(), payload.startAge);
      user.birthday = Faker.date.between(startDate, endDate);
      // user.avatar = Faker.image.imageUrl(150, 150, 'people');
      user.avatar = `${Faker.image.imageUrl(
        150,
        150,
        'people',
      )}?random=${Date.now()}`;

      // avatar download start
      // console.log('avatar = ', user.avatar);
      const imageBuffer = await this.http
        .get(user.avatar, { responseType: 'arraybuffer' })
        .toPromise()
        .then((res) => new Uint8Array(res.data));

      const Key = `${uuid.v4()}_${firstName}.png`;
      const buffer = imageBuffer.buffer;
      user.avatar = await this.uploadToS3WithBuffer(Buffer.from(buffer), Key);

      user.location = Faker.address.country();
      if (payload.location !== '') {
        user.location = `${locationArray[index % locationArray.length]} ${
          payload.country
        }`;
      }
      user.gender = Faker.random.arrayElement(['Woman', 'Man']);
      if (payload.gender !== '' && payload.gender !== 'Any') {
        user.gender = payload.gender;
      }
      user.lookingFor = Faker.random.arrayElement(['Woman', 'Man']);
      user.kids = Faker.random.arrayElement([
        'No Kids',
        'One Kid',
        'Two Kids',
        'Three Kids',
        'More then Three Kids',
      ]);
      user.body = Faker.random.arrayElement([
        'Slim',
        'Normal',
        'Athletic',
        'Muscular',
        'Chubby',
      ]);
      user.profession = Faker.random.arrayElement([
        'Seeking work',
        'Trainee',
        'Employee',
        'Public Official',
        'Housewife',
        'Retired ',
        'Self-employed',
        'Student',
      ]);
      user.language = Faker.random.arrayElement([
        'english',
        'arabic',
        'dutch',
        'french',
        'german',
        'italian',
        'portuguese',
        'russian',
        'spanish',
        'turkish',
        'hebrew',
      ]);
      user.education = Faker.random.arrayElement([
        'Not finished',
        'Secondary school',
        'High school',
        'High school diploma',
        'College/University',
        'Postgraduate degree',
      ]);
      user.relationshipStatus = Faker.random.arrayElement([
        'Single',
        'Relationship',
        'Openrelationship',
      ]);
      user.height = Faker.random.arrayElement([
        '149',
        '154',
        '159',
        '164',
        '169',
        '174',
        '180',
        '185',
        '190',
        '195',
        '200',
        '205',
        '210',
      ]);
      user.interestedIn = Faker.random.arrayElement([
        'Single',
        'Relationship',
        'Openrelationship',
      ]);
      user.smoker = Faker.random.arrayElement([
        'Non-Smoker',
        'Ex-Smoker',
        'Occasional Smoker',
        'Regular Smoker',
      ]);
      user.alcohol = Faker.random.arrayElement([
        'Never',
        'Sometimes',
        'Gladly',
      ]);
      res = this.updateUser(user);
    }
    return res;
  }

  uploadToS3WithBuffer(
    buffer: Buffer,
    path: string,
    meta = {},
  ): Promise<string> {
    const urlPrefix = 'https://kinkflirt-bucket.s3.eu-north-1.amazonaws.com';
    return new Promise<string>((resolve, reject) => {
      s3.putObject({
        Body: buffer,
        Bucket: S3_environment.ACCESS_BUCKET,
        Key: path,
        Metadata: meta,
      })
        .promise()
        .then(
          () => resolve(`${urlPrefix}/${path}`),
          (error) => reject(error),
        );
    });
  }
}
