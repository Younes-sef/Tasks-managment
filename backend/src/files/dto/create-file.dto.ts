import { IsNotEmpty, IsOptional, IsEnum, IsString, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFileDto {
  @ApiProperty({ example: 'my-document.pdf', description: 'The name of the file' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Important project specs', description: 'A brief description of the file' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'image', enum: ['image', 'video', 'audio'], description: 'The type of the file' })
  @IsNotEmpty()
  @IsEnum(['image', 'video', 'audio'])
  type: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', description: 'Creation date' })
  @IsNotEmpty()
  @IsDateString()
  createdAt: Date;

  @ApiPropertyOptional({ example: '2026-01-02T00:00:00.000Z', description: 'Update date' })
  @IsOptional()
  @IsDateString()
  updatedAt?: Date;
}
