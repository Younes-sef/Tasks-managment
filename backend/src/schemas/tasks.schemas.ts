import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from './auth.schema';


export type TaskDocument = Task & Document;

@Schema({timestamps: true})
export class Task {
  @Prop({required: true})
  title: string;

  @Prop()
  description: string;

  @Prop({enum:['pending','in-progress','completed'],default:'pending'})
  status: string;

  @Prop({enum:['low','medium','high'],default:'medium'})
  priority: string;

  @Prop({type: Date})
  dueDate: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: Number, default: 0 })
  order: number;
}
export const TaskSchema = SchemaFactory.createForClass(Task);


