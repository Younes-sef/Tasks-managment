import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/auth.schema';
import { ClerkAuthGuard } from './clerk-auth.guard';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [WebhooksController],
  providers: [ClerkAuthGuard],
  exports: [ClerkAuthGuard, MongooseModule]
})
export class AuthModule {}
