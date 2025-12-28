import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  status() {
    return this.appService.getStatus();
  }

  @Get('api/health')
  health() {
    return this.appService.getStatus();
  }
}
