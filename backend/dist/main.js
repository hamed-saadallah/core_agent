"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.useGlobalPipes(new common_1.ValidationPipe({ transform: true, whitelist: true }));
    app.setGlobalPrefix('api');
    // Get allowed CORS origins from environment
    const frontendUrl = configService.get('FRONTEND_URL', 'http://localhost:3001');
    const nodeEnv = configService.get('NODE_ENV', 'development');
    const corsOrigins = nodeEnv === 'production'
        ? [frontendUrl]
        : ['http://localhost:3001', 'http://localhost:3000', frontendUrl];
    app.enableCors({
        origin: corsOrigins,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Agent Core API')
        .setDescription('Core agentic platform API documentation')
        .setVersion('1.0.0')
        .addBearerAuth()
        .addTag('agents', 'Agent management endpoints')
        .addTag('tools', 'Tool management endpoints')
        .addTag('agent-runs', 'Agent run tracking endpoints')
        .addTag('auth', 'Authentication endpoints')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document);
    const port = configService.get('PORT', 3000);
    await app.listen(port);
    console.log(`Agent Core API is running on http://localhost:${port}`);
    console.log(`Swagger documentation available at http://localhost:${port}/docs`);
    console.log(`CORS enabled for origins: ${corsOrigins.join(', ')}`);
}
bootstrap();
