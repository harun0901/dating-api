import * as aws from 'aws-sdk';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { S3_environment } from './enums';
import { SendUploadDto } from './dtos/sendUpload.dto';
import { UploadEntity } from './entities/upload.entity';
import { getFromDto } from '../common/utils/repository.util';
import { UpdateTransactionDto } from '../transaction/dtos/update-transaction.dto';
import { UsersService } from '../users/users.service';
import { UpdateUploadDto } from './dtos/update-upload.dto';
import { GetUploadDto } from './dtos/get-upload.dto';

aws.config.update({
  accessKeyId: S3_environment.ACCESS_KEY_ID,
  secretAccessKey: S3_environment.SECRET_ACCESS_KEY,
  region: S3_environment.AWS_REGION,
});
const s3 = new aws.S3();

@Injectable()
export class UploadService {
  URL_EXPIRATION_SECONDS: number;
  s3Params: any;
  uploadURL: string;

  constructor(
    @InjectRepository(UploadEntity)
    private uploadRepository: Repository<UploadEntity>,
    private userService: UsersService,
  ) {
    this.uploadURL = '';
    this.URL_EXPIRATION_SECONDS = 300;
  }

  async getUploadURL(fileName: string): Promise<string> {
    const Key = fileName;
    // Get signed URL from S3
    this.s3Params = {
      Bucket: S3_environment.ACCESS_BUCKET,
      Key,
      Expires: this.URL_EXPIRATION_SECONDS,
      ContentType: 'image/jpeg',
    };
    this.uploadURL = await s3.getSignedUrlPromise('putObject', this.s3Params);
    return this.uploadURL;
  }

  async findByUserId(userId: string): Promise<UploadEntity[]> {
    return this.uploadRepository.find({
      where: {
        uploader: {
          id: userId,
        },
      },
    });
  }

  async findByUserIdSate(payload: GetUploadDto): Promise<UploadEntity[]> {
    return this.uploadRepository.find({
      where: {
        uploader: {
          id: payload.uploaderId,
        },
        state: payload.state
      },
    });
  }

  async registerUpload(
    dto: SendUploadDto,
    throwError = true,
  ): Promise<UploadEntity> {
    const upload = getFromDto<UploadEntity>(
      dto,
      new UploadEntity(),
    );
    upload.uploader = await this.userService.findById(dto.uploaderId);
    return this.uploadRepository.save(upload);
  }

  async updateUpload(
    dto: UpdateUploadDto,
    throwError = true,
  ): Promise<UploadEntity> {
    const upload = await this.findById(dto.uploadId);
    upload.data = dto.data;
    upload.state = dto.state;
    return this.uploadRepository.save(upload);
  }

  async findById(id: string): Promise<UploadEntity> {
    return this.uploadRepository.findOne({ id });
  }

  async updateUser(transaction: UploadEntity): Promise<UploadEntity> {
    return this.uploadRepository.save(transaction);
  }

  async count(): Promise<number> {
    return this.uploadRepository.count();
  }

  async find(): Promise<UploadEntity[]> {
    return this.uploadRepository.find();
  }
}
