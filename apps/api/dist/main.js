"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const dotenv_1 = __importDefault(require("dotenv"));
const node_path_1 = __importDefault(require("node:path"));
const common_1 = require("@nestjs/common");
const envPath = node_path_1.default.resolve(process.cwd(), 'apps/api/.env');
dotenv_1.default.config({ path: envPath });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const prisma_service_1 = require("./prisma/prisma.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: ['http://localhost:3000'],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const prismaService = app.get(prisma_service_1.PrismaService);
    await prismaService.enableShutdownHooks(app);
    const port = Number(process.env.PORT) || 4000;
    await app.listen(port);
    const appUrl = await app.getUrl();
    common_1.Logger.log(`🚀 Servidor storiesV13 listo en ${appUrl}`, 'Bootstrap');
    common_1.Logger.log('CORS habilitado para http://localhost:3000', 'Bootstrap');
}
bootstrap().catch((error) => {
    common_1.Logger.error('Fallo crítico al iniciar el servidor', error);
    process.exit(1);
});
