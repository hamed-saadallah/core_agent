import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  app.setGlobalPrefix('api');

  // Get allowed CORS origins from environment
  const frontendUrl = configService.get<string>('FRONTEND_URL', 'http://localhost:3001');
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');
  const corsOrigins = nodeEnv === 'production' 
    ? [frontendUrl]
    : ['http://localhost:3001', 'http://localhost:3000', frontendUrl];

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const config = new DocumentBuilder()
    .setTitle('Agent Core API')
    .setDescription('Core agentic platform API documentation')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('agents', 'Agent management endpoints')
    .addTag('tools', 'Tool management endpoints')
    .addTag('agent-runs', 'Agent run tracking endpoints')
    .addTag('auth', 'Authentication endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port, '0.0.0.0');
  console.log(`Agent Core API is running on port ${port}`);
  console.log(`Health check available at /api/health`);
  console.log(`Swagger documentation available at /docs`);
  console.log(`CORS enabled for origins: ${corsOrigins.join(', ')}`);
}

bootstrap();
