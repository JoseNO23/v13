import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatus() {
    return { mensaje: 'storiesV13 API OK' };
  }
}

