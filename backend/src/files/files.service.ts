import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { File, FileDocument } from 'src/schemas/file.schema';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(File.name) private readonly fileModel: Model<FileDocument>,
  ) {}

  async uploadFile(file: Express.Multer.File) {
    try {
      const newFile = new this.fileModel({
        originalName: file.originalname,
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size,
      });
      return await newFile.save();
    } catch (error) {
      console.error('Upload Error:', error);
      throw new Error('Upload failed');
    }
  }

  async getAllFiles(): Promise<File[]> {
    return await this.fileModel.find().exec();
  }

  async getFileById(id: string): Promise<File> {
    const file = await this.fileModel.findById(id);
    if (!file) {
      throw new NotFoundException('File not found');
    }
    return file;
  }

  async deleteFile(id: string): Promise<void> {
    const result = await this.fileModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('File not found');
    }
  }
}
