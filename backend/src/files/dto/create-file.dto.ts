import { IsNotEmpty, IsOptional, IsEnum, IsString, IsDateString } from 'class-validator';

export class CreateFileDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsEnum(['image', 'video', 'audio'])
  type: string;

  @IsNotEmpty()
  @IsDateString()
  createdAt: Date;

  @IsOptional()
  @IsDateString()
  updatedAt?: Date;
}
