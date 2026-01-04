import { PutObjectCommand } from '@aws-sdk/client-s3';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { r2 } from './r2.client';

@Injectable()
export class BrandingService {
  constructor(private readonly prisma: PrismaService) {}

  private ensureR2Env() {
    if (!process.env.R2_BUCKET || !process.env.R2_PUBLIC_BASE_URL) {
      throw new BadRequestException('R2 no configurado.');
    }
  }

  async uploadLogo(file: Express.Multer.File, actorUserId: string, actorRole: Role) {
    if (actorRole !== Role.OWNER) {
      throw new ForbiddenException('Solo OWNER puede cambiar el branding.');
    }

    if (!file?.buffer) {
      throw new BadRequestException('Archivo requerido.');
    }

    this.ensureR2Env();

    const key = 'branding/logo.png';

    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype || 'image/png',
        CacheControl: 'public, max-age=3600',
      }),
    );

    const publicUrl = `${process.env.R2_PUBLIC_BASE_URL}/${key}`;

    const settings = await this.prisma.siteSettings.upsert({
      where: { id: 'default' },
      create: { id: 'default', logoKey: key, logoUrl: publicUrl, updatedById: actorUserId },
      update: { logoKey: key, logoUrl: publicUrl, updatedById: actorUserId },
    });

    return { logoKey: settings.logoKey, logoUrl: settings.logoUrl };
  }

  async getBrandingPublic() {
    const settings = await this.prisma.siteSettings.findUnique({ where: { id: 'default' } });
    if (!process.env.R2_PUBLIC_BASE_URL) {
      return { logoUrl: settings?.logoUrl ?? null };
    }

    const logoUrl =
      settings?.logoUrl ||
      (settings?.logoKey ? `${process.env.R2_PUBLIC_BASE_URL}/${settings.logoKey}` : null);

    return { logoUrl };
  }
}
