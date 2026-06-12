import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { File, FileDocument } from 'src/schemas/file.schema';
import { EventsGateway } from '../events/events.gateway';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(File.name) private readonly fileModel: Model<FileDocument>,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async uploadFile(file: Express.Multer.File, userId: string) {
    try {
      const newFile = new this.fileModel({
        originalName: file.originalname,
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size,
        userId: userId,
      });
      const savedFile = await newFile.save();
      
      // Emit a real-time event to connected clients
      this.eventsGateway.emitToUser(userId, 'notification', {
        type: 'success',
        message: `File processing complete: ${file.originalname}`,
      });
      
      return savedFile;
    } catch (error) {
      console.error('Upload Error:', error);
      throw new Error('Upload failed');
    }
  }

  async getAllFiles(userId: string): Promise<File[]> {
    return await this.fileModel.find({ userId }).exec();
  }

  async getFileById(id: string, userId: string): Promise<File> {
    const file = await this.fileModel.findOne({ _id: id, userId });
    if (!file) {
      throw new NotFoundException('File not found');
    }
    return file;
  }

  async deleteFile(id: string, userId: string): Promise<void> {
    const result = await this.fileModel.findOneAndDelete({ _id: id, userId });
    if (!result) {
      throw new NotFoundException('File not found');
    }

    try {
      const filePath = path.join(process.cwd(), 'uploads', result.filename);
      await fs.unlink(filePath);
    } catch (error) {
      console.error(`Failed to delete physical file ${result.filename}:`, error);
      // We don't throw here because the DB record is already deleted
    }
  }
}
