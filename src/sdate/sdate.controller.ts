import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { SdateService } from './sdate.service';
import { HealthResponse } from './common/models/health.response';

@Controller('sdate')
export class SdateController {
  constructor(private readonly sdateService: SdateService) {}

  @Get()
  getHello(): string {
    return this.sdateService.getHello();
  }
}
