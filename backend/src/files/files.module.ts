import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { File, FileSchema } from 'src/schemas/file.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: File.name, schema: FileSchema }
    ]),
    AuthModule
  ],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService] // if used outside this module
})
export class FilesModule {}
