import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class VerifyEmailCodeDto {
  @IsEmail({}, { message: 'El correo no es valido.' })
  email!: string;

  @IsString({ message: 'El codigo es obligatorio.' })
  @Length(6, 6, { message: 'El codigo debe tener 6 digitos.' })
  @Matches(/^\d{6}$/, { message: 'El codigo debe ser numerico.' })
  code!: string;
}
