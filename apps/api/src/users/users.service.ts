import { Injectable, NotFoundException } from '@nestjs/common';
import type { ProfileVisibility } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePrivacyDto } from './dto/update-privacy.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

const DEFAULT_PRIVACY: Omit<UpdatePrivacyDto, 'profileVisibility'> & {
  profileVisibility: ProfileVisibility;
} = {
  profileVisibility: 'PUBLIC',
  showBio: true,
  showWebsite: true,
  showDiscord: false,
  showTwitter: true,
  showInstagram: true,
  showEmail: false,
  showCreatedAt: true,
  showFavorites: false,
  showStats: true,
  showLastSeen: false,
  allowDMs: false,
};

function normalizeOptionalString(value: string | undefined) {
  if (value === undefined) {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeOptionalNonNullString(value: string | undefined) {
  if (value === undefined) {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function buildAssetUrl(key: string | null | undefined) {
  const base = process.env.R2_PUBLIC_BASE_URL ?? process.env.PUBLIC_ASSET_BASE_URL;
  if (!key || !base) {
    return undefined;
  }
  return `${base.replace(/\/+$/, '')}/${key.replace(/^\/+/, '')}`;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getPublicProfile(username: string) {
    const handle = username.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { username: handle },
      include: { privacy: true },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    const privacy = user.privacy ?? DEFAULT_PRIVACY;
    if (privacy.profileVisibility === 'PRIVATE') {
      throw new NotFoundException('Perfil no disponible.');
    }

    const profile: Record<string, unknown> = {
      username: user.username,
      displayName: user.displayName ?? undefined,
      avatarUrl: buildAssetUrl(user.avatarKey),
      bannerUrl: buildAssetUrl(user.bannerKey),
      profileVisibility: privacy.profileVisibility,
    };

    if (privacy.showBio) {
      profile.bio = user.bio ?? undefined;
    }

    if (privacy.showWebsite) {
      profile.websiteUrl = user.websiteUrl ?? undefined;
    }

    if (privacy.showDiscord) {
      profile.discordTag = user.discordTag ?? undefined;
    }

    if (privacy.showTwitter) {
      profile.twitterUrl = user.twitterUrl ?? undefined;
    }

    if (privacy.showInstagram) {
      profile.instagramUrl = user.instagramUrl ?? undefined;
    }

    if (privacy.showCreatedAt) {
      profile.createdAt = user.createdAt.toISOString();
    }

    if (privacy.showStats) {
      const storiesPublished = await this.prisma.story.count({
        where: { authorId: user.id },
      });
      profile.stats = { storiesPublished };
    }

    if (privacy.showLastSeen) {
      profile.lastLoginAt = user.lastLoginAt?.toISOString();
    }

    return profile;
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { privacy: true },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      displayName: user.displayName,
      bio: user.bio,
      avatarKey: user.avatarKey,
      bannerKey: user.bannerKey,
      websiteUrl: user.websiteUrl,
      discordTag: user.discordTag,
      twitterUrl: user.twitterUrl,
      instagramUrl: user.instagramUrl,
      language: user.language,
      theme: user.theme,
      emailVerifiedAt: user.emailVerifiedAt,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      privacy: user.privacy ?? DEFAULT_PRIVACY,
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const data = {
      displayName: normalizeOptionalString(dto.displayName),
      bio: normalizeOptionalString(dto.bio),
      avatarKey: normalizeOptionalString(dto.avatarKey),
      bannerKey: normalizeOptionalString(dto.bannerKey),
      websiteUrl: normalizeOptionalString(dto.websiteUrl),
      discordTag: normalizeOptionalString(dto.discordTag),
      twitterUrl: normalizeOptionalString(dto.twitterUrl),
      instagramUrl: normalizeOptionalString(dto.instagramUrl),
      language: normalizeOptionalNonNullString(dto.language),
      theme: normalizeOptionalNonNullString(dto.theme),
    };

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        username: true,
        displayName: true,
        bio: true,
        avatarKey: true,
        bannerKey: true,
        websiteUrl: true,
        discordTag: true,
        twitterUrl: true,
        instagramUrl: true,
        language: true,
        theme: true,
        updatedAt: true,
      },
    });

    return {
      mensaje: 'Perfil actualizado.',
      profile: updated,
    };
  }

  async updatePrivacy(userId: string, dto: UpdatePrivacyDto) {
    const updateData = Object.fromEntries(
      Object.entries(dto).filter(([, value]) => value !== undefined),
    );

    const privacy = await this.prisma.userPrivacy.upsert({
      where: { userId },
      update: updateData,
      create: {
        userId,
        ...DEFAULT_PRIVACY,
        ...updateData,
      },
    });

    return {
      mensaje: 'Privacidad actualizada.',
      privacy,
    };
  }
}
