import { Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role } from '@prisma/client';
import { AuthUser } from '../auth/auth-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { BrandingService } from './branding.service';

@Controller()
export class BrandingController {
  constructor(private readonly brandingService: BrandingService) {}

  @Get('public/branding')
  getPublicBranding() {
    return this.brandingService.getBrandingPublic();
  }

  @Post('admin/branding/logo')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 2 * 1024 * 1024 } }))
  uploadLogo(
    @UploadedFile() file: Express.Multer.File,
    @AuthUser('id') actorUserId: string,
    @AuthUser('role') actorRole: Role,
  ) {
    return this.brandingService.uploadLogo(file, actorUserId, actorRole);
  }
}
