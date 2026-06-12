import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    UploadedFile,
    UseInterceptors,
    UseGuards,
    Res,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { FilesService } from './files.service';
  import { extname, join } from 'path';
  import { diskStorage } from 'multer';
  import { Response } from 'express';
  import { ClerkAuthGuard } from 'src/auth/clerk-auth.guard';
  import { CurrentUser } from 'src/auth/current-user.decorator';
  import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiConsumes, ApiBody, ApiParam } from '@nestjs/swagger';
  
  @ApiTags('Files')
  @ApiBearerAuth()
  @Controller('files')
  @UseGuards(ClerkAuthGuard)
  export class FilesController {
    constructor(private readonly filesService: FilesService) {}
  
    @Post('upload')
    @ApiOperation({ summary: 'Upload a new file' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    })
    @ApiResponse({ status: 201, description: 'File successfully uploaded.' })
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
    async uploadFile(@UploadedFile() file: Express.Multer.File, @CurrentUser() user: any) {
      return this.filesService.uploadFile(file, user.userId);
    }
  
    @Get()
    @ApiOperation({ summary: 'Get all files for the current user' })
    @ApiResponse({ status: 200, description: 'List of files.' })
    async getAllFiles(@CurrentUser() user: any) {
      return this.filesService.getAllFiles(user.userId);
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get a specific file by ID' })
    @ApiParam({ name: 'id', description: 'The ID of the file', type: String })
    @ApiResponse({ status: 200, description: 'The requested file metadata.' })
    @ApiResponse({ status: 404, description: 'File not found.' })
    async getFile(@Param('id') id: string, @CurrentUser() user: any) {
      return this.filesService.getFileById(id, user.userId);
    }

    @Get(':id/download')
    @ApiOperation({ summary: 'Download a specific file' })
    @ApiParam({ name: 'id', description: 'The ID of the file to download', type: String })
    async downloadFile(@Param('id') id: string, @CurrentUser() user: any, @Res() res: Response) {
      const file = await this.filesService.getFileById(id, user.userId);
      const filePath = join(process.cwd(), 'uploads', file.filename);
      res.download(filePath, file.originalName);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a file' })
    @ApiParam({ name: 'id', description: 'The ID of the file to delete', type: String })
    @ApiResponse({ status: 200, description: 'File successfully deleted.' })
    @ApiResponse({ status: 404, description: 'File not found.' })
    async deleteFile(@Param('id') id: string, @CurrentUser() user: any) {
      return this.filesService.deleteFile(id, user.userId);
    }
  }