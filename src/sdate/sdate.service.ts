import { Injectable } from '@nestjs/common';

@Injectable()
export class SdateService {
  getHello(): string {
    return 'Hello World!';
  }
}
