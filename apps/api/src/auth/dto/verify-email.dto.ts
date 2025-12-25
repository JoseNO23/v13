import { IsString, MinLength } from 'class-validator';

export class VerifyEmailDto {
  @IsString({ message: 'El token es obligatorio.' })
  @MinLength(1, { message: 'El token es obligatorio.' })
  token!: string;
}

