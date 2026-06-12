import { IsNotEmpty, IsOptional, IsEnum, IsString, IsDateString, IsArray, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ example: 'Buy groceries', description: 'The title of the task' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Milk, bread, eggs', description: 'Detailed description of the task' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'pending', enum: ['pending', 'in-progress', 'completed'], description: 'The status of the task' })
  @IsOptional()
  @IsEnum(['pending', 'in-progress', 'completed'], { message: 'Status must be one of pending, in-progress, or completed' })
  status?: string;

  @ApiPropertyOptional({ example: 'medium', enum: ['low', 'medium', 'high'], description: 'The priority of the task' })
  @IsOptional()
  @IsEnum(['low', 'medium', 'high'], { message: 'Priority must be one of low, medium, or high' })
  priority?: string;

  @ApiPropertyOptional({ example: '2026-12-31T23:59:59.000Z', description: 'The due date for the task' })
  @IsOptional()
  @IsDateString()
  dueDate?: Date;

  @ApiPropertyOptional({ example: ['frontend', 'bug'], description: 'Tags associated with the task' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ example: 0, description: 'Order of the task in the Kanban board' })
  @IsOptional()
  @IsNumber()
  order?: number;
}