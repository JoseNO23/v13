import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString({ message: 'El nombre de usuario es obligatorio.' })
  @MinLength(3, { message: 'El nombre de usuario debe tener al menos 3 caracteres.' })
  username!: string;

  @IsEmail({}, { message: 'El correo no es valido.' })
  email!: string;

  @IsString({ message: 'La contrasena es obligatoria.' })
  @MinLength(8, { message: 'La contrasena debe tener al menos 8 caracteres.' })
  password!: string;
}
