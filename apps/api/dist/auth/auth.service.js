"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const node_crypto_1 = require("node:crypto");
const jwt = __importStar(require("jsonwebtoken"));
const nodemailer = __importStar(require("nodemailer"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
const prisma_service_1 = require("../prisma/prisma.service");
const JWT_SECRET = 'storiesv13-dev-secret';
const VERIFICATION_TTL_MINUTES = 10;
const VERIFICATION_CODE_LENGTH = 6;
const DEFAULT_API_BASE_URL = 'http://localhost:4000';
let AuthService = AuthService_1 = class AuthService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    generateVerificationCode() {
        return (0, node_crypto_1.randomInt)(0, 10 ** VERIFICATION_CODE_LENGTH)
            .toString()
            .padStart(VERIFICATION_CODE_LENGTH, '0');
    }
    getVerificationLink(token) {
        var _a;
        const baseUrl = (_a = process.env.API_BASE_URL) !== null && _a !== void 0 ? _a : DEFAULT_API_BASE_URL;
        return `${baseUrl}/auth/verify-email?token=${token}`;
    }
    async sendVerificationEmail(params) {
        var _a;
        const sendgridKey = process.env.SENDGRID_API_KEY;
        const sendgridFrom = process.env.SENDGRID_FROM;
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
        if (sendgridKey && sendgridFrom) {
            try {
                mail_1.default.setApiKey(sendgridKey);
                await mail_1.default.send({
                    to: params.email,
                    from: sendgridFrom,
                    subject,
                    text,
                    html,
                });
                return true;
            }
            catch (error) {
                this.logger.error('Error enviando correo de verificacion con SendGrid.', error);
                return false;
            }
        }
        const smtpHost = process.env.SMTP_HOST;
        const smtpPort = Number((_a = process.env.SMTP_PORT) !== null && _a !== void 0 ? _a : 0);
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
        }
        catch (error) {
            this.logger.error('Error enviando correo de verificacion.', error);
            return false;
        }
    }
    async register(dto) {
        const email = dto.email.trim().toLowerCase();
        const existing = await this.prisma.user.findUnique({ where: { email } });
        if (existing) {
            throw new common_1.ConflictException('El correo ya est? registrado.');
        }
        const passwordHash = await bcrypt.hash(dto.password, 12);
        const tokenValue = (0, node_crypto_1.randomBytes)(48).toString('hex');
        const codeValue = this.generateVerificationCode();
        const expiresAt = new Date(Date.now() + VERIFICATION_TTL_MINUTES * 60 * 1000);
        const result = await this.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email,
                    passwordHash,
                    role: client_1.Role.USER,
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
    async verifyEmail(token) {
        if (!token) {
            throw new common_1.BadRequestException('Token de verificaci?n requerido.');
        }
        const record = await this.prisma.emailVerificationToken.findUnique({ where: { token } });
        if (!record) {
            throw new common_1.NotFoundException('Token de verificaci?n no encontrado.');
        }
        if (record.expiresAt < new Date()) {
            await this.prisma.emailVerificationToken.delete({ where: { id: record.id } });
            throw new common_1.BadRequestException('El token de verificaci?n ha expirado.');
        }
        const user = await this.prisma.user.findUnique({ where: { id: record.userId } });
        if (!user) {
            await this.prisma.emailVerificationToken.delete({ where: { id: record.id } });
            throw new common_1.NotFoundException('Usuario asociado al token no encontrado.');
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
    async verifyEmailCode(email, code) {
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedCode = code.trim();
        const user = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado.');
        }
        const record = await this.prisma.emailVerificationToken.findFirst({
            where: { userId: user.id, code: normalizedCode },
        });
        if (!record) {
            throw new common_1.NotFoundException('Codigo de verificacion no encontrado.');
        }
        if (record.expiresAt < new Date()) {
            await this.prisma.emailVerificationToken.delete({ where: { id: record.id } });
            throw new common_1.BadRequestException('El codigo de verificacion ha expirado.');
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
    async login(dto) {
        const email = dto.email.trim().toLowerCase();
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciales inv?lidas.');
        }
        const valid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!valid) {
            throw new common_1.UnauthorizedException('Credenciales inv?lidas.');
        }
        if (!user.emailVerifiedAt) {
            throw new common_1.UnauthorizedException('Debes verificar tu correo electr?nico antes de iniciar sesi?n.');
        }
        const payload = { sub: user.id, email: user.email, role: user.role };
        const token = jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256', expiresIn: '1h' });
        return {
            mensaje: 'Inicio de sesi?n exitoso.',
            token,
            expiraEn: '1h',
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuthService);
