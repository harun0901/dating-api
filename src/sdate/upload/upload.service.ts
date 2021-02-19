import { Injectable } from '@nestjs/common';
import { S3_environment } from './enums';
import * as aws from 'aws-sdk';

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

  constructor() {
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
}
