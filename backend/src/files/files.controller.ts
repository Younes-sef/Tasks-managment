import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    UploadedFile,
    UseInterceptors,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { FilesService } from './files.service';
  import { extname } from 'path';
  import { diskStorage } from 'multer';
  
  @Controller('files')
  export class FilesController {
    constructor(private readonly filesService: FilesService) {}
  
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        }
      })
    }))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
      return this.filesService.uploadFile(file);
    }
    @Get()
    async getAllFiles() {
      return this.filesService.getAllFiles();
    }

  
    @Get(':id')
    async getFile(@Param('id') id: string) {
      return this.filesService.getFileById(id);
    }
  
    @Delete(':id')
    async deleteFile(@Param('id') id: string) {
      return this.filesService.deleteFile(id);
    }
  }
  