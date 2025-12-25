import 'reflect-metadata';
import dotenv from 'dotenv';
import path from 'node:path';
import { Logger, ValidationPipe } from '@nestjs/common';

const envPath = path.resolve(process.cwd(), 'apps/api/.env');
dotenv.config({ path: envPath });
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  const port = Number(process.env.PORT) || 4000;
  await app.listen(port);

  const appUrl = await app.getUrl();
  Logger.log(`🚀 Servidor storiesV13 listo en ${appUrl}`, 'Bootstrap');
  Logger.log('CORS habilitado para http://localhost:3000', 'Bootstrap');
}

bootstrap().catch((error) => {
  Logger.error('Fallo crítico al iniciar el servidor', error);
  process.exit(1);
});
