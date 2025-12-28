import { IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  displayName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  avatarKey?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  bannerKey?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  websiteUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  discordTag?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  twitterUrl?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  instagramUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  language?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  theme?: string;
}
