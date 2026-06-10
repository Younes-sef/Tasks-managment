import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ FIX CORS HERE
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true, // Optional, but helps for cookies/auth headers
  });

  await app.listen(3001); // ✅ Make sure this matches your current port
}
bootstrap();
