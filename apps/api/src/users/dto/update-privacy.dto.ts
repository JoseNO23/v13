import { ProfileVisibility } from '@prisma/client';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';

export class UpdatePrivacyDto {
  @IsOptional()
  @IsEnum(ProfileVisibility)
  profileVisibility?: ProfileVisibility;

  @IsOptional()
  @IsBoolean()
  showBio?: boolean;

  @IsOptional()
  @IsBoolean()
  showWebsite?: boolean;

  @IsOptional()
  @IsBoolean()
  showDiscord?: boolean;

  @IsOptional()
  @IsBoolean()
  showTwitter?: boolean;

  @IsOptional()
  @IsBoolean()
  showInstagram?: boolean;

  @IsOptional()
  @IsBoolean()
  showEmail?: boolean;

  @IsOptional()
  @IsBoolean()
  showCreatedAt?: boolean;

  @IsOptional()
  @IsBoolean()
  showFavorites?: boolean;

  @IsOptional()
  @IsBoolean()
  showStats?: boolean;

  @IsOptional()
  @IsBoolean()
  showLastSeen?: boolean;

  @IsOptional()
  @IsBoolean()
  allowDMs?: boolean;
}
