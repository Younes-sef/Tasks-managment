import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { Task, TaskSchema } from 'src/schemas/tasks.schemas';

import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    AuthModule,
  ],
  controllers: [TasksController],
  providers: [TasksService]
})
export class TasksModule {}
