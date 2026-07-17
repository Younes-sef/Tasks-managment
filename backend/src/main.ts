import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Security Middleware
  app.use(helmet());

  // ✅ Global Exception Filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // ✅ Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ✅ Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Tasks Manager API')
    .setDescription('The Tasks Manager API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // ✅ FIX CORS HERE
  app.enableCors({
    origin: [
      'http://localhost:3000',
      /\.vercel\.app$/,
      process.env.FRONTEND_URL || '',
    ],
    credentials: true, // Optional, but helps for cookies/auth headers
  });

  await app.listen(3001); // ✅ Make sure this matches your current port
}
bootstrap();
