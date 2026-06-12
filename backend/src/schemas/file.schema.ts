import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from './auth.schema';
import { Task } from './tasks.schemas';

export type FileDocument = File & Document;

@Schema({ timestamps: true })
export class File extends Document {
  @Prop({ required: true })
  originalName: string;

  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  mimetype: string;

  @Prop({ required: true })
  size: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: false })
  taskId?: Task;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ type: Object, required: false })
  metadata?: Record<string, any>;
}

export const FileSchema = SchemaFactory.createForClass(File);
