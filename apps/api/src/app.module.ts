import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BrandingModule } from './branding/branding.module';
import { PrismaModule } from './prisma/prisma.module';
import { TaxonomyModule } from './taxonomy/taxonomy.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, BrandingModule, TaxonomyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
