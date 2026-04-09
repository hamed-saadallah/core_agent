import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:3000'],
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

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Agent Core API is running on http://localhost:${port}`);
  console.log(`Swagger documentation available at http://localhost:${port}/docs`);
}

bootstrap();
