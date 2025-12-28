import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomBytes, randomInt } from 'node:crypto';
import * as jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import * as nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';
import { PrismaService } from '../prisma/prisma.service';
import { JWT_SECRET } from './auth.constants';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

const VERIFICATION_TTL_MINUTES = 10;
const VERIFICATION_CODE_LENGTH = 6;
const DEFAULT_API_BASE_URL = 'http://localhost:4000';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly prisma: PrismaService) {}

  private generateVerificationCode() {
    return randomInt(0, 10 ** VERIFICATION_CODE_LENGTH)
      .toString()
      .padStart(VERIFICATION_CODE_LENGTH, '0');
  }

  private getVerificationLink(token: string) {
    const publicUrl = process.env.APP_PUBLIC_URL;
    const baseUrl = publicUrl ?? process.env.API_BASE_URL ?? DEFAULT_API_BASE_URL;
    return `${baseUrl}/auth/verify-email?token=${token}`;
  }

  private async sendVerificationEmail(params: { email: string; code: string; link: string }) {
    const sendgridKey = process.env.SENDGRID_API_KEY;
    const sendgridFrom = process.env.SENDGRID_FROM;
    const sendgridTemplateId = process.env.SENDGRID_TEMPLATE_VERIFY_ID;

    const subject = 'Verifica tu correo';
    const text = [
      `Codigo de verificacion: ${params.code}`,
      `Link de verificacion: ${params.link}`,
      'Este codigo vence en 10 minutos.',
    ].join('\n');

    const html = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>Verifica tu correo</title>
  </head>
  <body>
    <p>Codigo de verificacion: <strong>${params.code}</strong></p>
    <p>Link de verificacion: <a href="${params.link}">${params.link}</a></p>
    <p>Este codigo vence en 10 minutos.</p>
  </body>
</html>`;

    if (sendgridKey && sendgridFrom && sendgridTemplateId) {
      try {
        sgMail.setApiKey(sendgridKey);
        await sgMail.send({
          to: params.email,
          from: { email: sendgridFrom, name: 'Viernes13' },
          templateId: sendgridTemplateId,
          dynamicTemplateData: {
            code: params.code,
            link: params.link,
            minutes: VERIFICATION_TTL_MINUTES,
          },
        });
        return true;
      } catch (error) {
        this.logger.error('Error enviando correo de verificacion con SendGrid template.', error);
        return false;
      }
    }

    if (sendgridKey && sendgridFrom) {
      try {
        sgMail.setApiKey(sendgridKey);
        await sgMail.send({
          to: params.email,
          from: sendgridFrom,
          subject,
          text,
          html,
        });
        return true;
      } catch (error) {
        this.logger.error('Error enviando correo de verificacion con SendGrid.', error);
        return false;
      }
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT ?? 0);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM;

    if (!smtpHost || !smtpPort || !smtpFrom) {
      this.logger.warn('SMTP/SendGrid no configurado. No se envio el correo de verificacion.');
      return false;
    }

    const transport = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: smtpUser && smtpPass ? { user: smtpUser, pass: smtpPass } : undefined,
    });

    try {
      await transport.sendMail({
        from: smtpFrom,
        to: params.email,
        subject,
        text,
        html,
      });
      return true;
    } catch (error) {
      this.logger.error('Error enviando correo de verificacion.', error);
      return false;
    }
  }

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();
    const rawUsername = dto.username.trim();
    const username = rawUsername.toLowerCase();

    const existingByEmail = await this.prisma.user.findUnique({ where: { email } });
    if (existingByEmail) {
      throw new ConflictException('El correo ya esta registrado.');
    }

    const existingByUsername = await this.prisma.user.findUnique({ where: { username } });
    if (existingByUsername) {
      throw new ConflictException('El nombre de usuario ya esta en uso.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const tokenValue = randomBytes(48).toString('hex');
    const codeValue = this.generateVerificationCode();
    const expiresAt = new Date(Date.now() + VERIFICATION_TTL_MINUTES * 60 * 1000);

    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          username,
          displayName: rawUsername,
          role: Role.USER,
        },
      });

      await tx.emailVerificationToken.create({
        data: {
          token: tokenValue,
          code: codeValue,
          userId: user.id,
          expiresAt,
        },
      });

      await tx.userPrivacy.create({
        data: {
          userId: user.id,
        },
      });

      return user;
    });

    const verificationLink = this.getVerificationLink(tokenValue);

    this.logger.log(`Token de verificacion generado para ${result.email}: ${verificationLink}`);
    this.logger.log(`Codigo de verificacion generado para ${result.email}: ${codeValue}`);

    const emailSent = await this.sendVerificationEmail({
      email: result.email,
      code: codeValue,
      link: verificationLink,
    });

    return {
      mensaje: emailSent
        ? 'Usuario registrado. Revisa tu correo para verificar la cuenta.'
        : 'Usuario registrado. No se pudo enviar el correo de verificacion. Revisa la consola del servidor.',
      emailEnviado: emailSent,
    };
  }
  async verifyEmail(token: string) {
    if (!token) {
      throw new BadRequestException('Token de verificaci?n requerido.');
    }

    const record = await this.prisma.emailVerificationToken.findUnique({ where: { token } });
    if (!record) {
      throw new NotFoundException('Token de verificaci?n no encontrado.');
    }

    if (record.expiresAt < new Date()) {
      await this.prisma.emailVerificationToken.delete({ where: { id: record.id } });
      throw new BadRequestException('El token de verificaci?n ha expirado.');
    }

    const user = await this.prisma.user.findUnique({ where: { id: record.userId } });
    if (!user) {
      await this.prisma.emailVerificationToken.delete({ where: { id: record.id } });
      throw new NotFoundException('Usuario asociado al token no encontrado.');
    }

    if (user.emailVerifiedAt) {
      await this.prisma.emailVerificationToken.delete({ where: { id: record.id } });
      return { mensaje: 'El correo ya estaba verificado.' };
    }

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: record.userId },
        data: { emailVerifiedAt: new Date() },
      }),
      this.prisma.emailVerificationToken.delete({ where: { id: record.id } }),
    ]);

    return { mensaje: 'Correo verificado correctamente. Ya puedes iniciar sesi?n.' };
  }

  async verifyEmailCode(email: string, code: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedCode = code.trim();
    const user = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    const record = await this.prisma.emailVerificationToken.findFirst({
      where: { userId: user.id, code: normalizedCode },
    });

    if (!record) {
      throw new NotFoundException('Codigo de verificacion no encontrado.');
    }

    if (record.expiresAt < new Date()) {
      await this.prisma.emailVerificationToken.delete({ where: { id: record.id } });
      throw new BadRequestException('El codigo de verificacion ha expirado.');
    }

    if (user.emailVerifiedAt) {
      await this.prisma.emailVerificationToken.delete({ where: { id: record.id } });
      return { mensaje: 'El correo ya estaba verificado.' };
    }

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: record.userId },
        data: { emailVerifiedAt: new Date() },
      }),
      this.prisma.emailVerificationToken.delete({ where: { id: record.id } }),
    ]);

    return { mensaje: 'Correo verificado correctamente. Ya puedes iniciar sesion.' };
  }

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Credenciales inv?lidas.');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Credenciales inv?lidas.');
    }

    if (!user.emailVerifiedAt) {
      throw new UnauthorizedException('Debes verificar tu correo electr?nico antes de iniciar sesi?n.');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256', expiresIn: '1h' });

    return {
      mensaje: 'Inicio de sesi?n exitoso.',
      token,
      expiraEn: '1h',
    };
  }
}
