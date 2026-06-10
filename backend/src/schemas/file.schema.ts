import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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

  @Prop({ required: false })
  taskId?: string;

 

  @Prop({ type: Object, required: false })
  metadata?: Record<string, any>;
}

export const FileSchema = SchemaFactory.createForClass(File);
