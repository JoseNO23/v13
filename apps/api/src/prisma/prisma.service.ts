import { INestApplication, Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async enableShutdownHooks(app: INestApplication) {
    // Desde Prisma 5.0.0, el hook 'beforeExit' no funciona con library engine
    // Usamos eventos de process directamente
    process.on('beforeExit', async () => {
      await app.close();
    });
  }
}

