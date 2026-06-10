import { IsNotEmpty, IsOptional, IsEnum, IsString, IsDateString } from 'class-validator';


export class CreateTaskDto{
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsEnum(['todo','inProgress','done'],{message:'Status must be one of todo, inProgress, or done'})
    status?: string;

    @IsOptional()
    @IsEnum(['low','medium','high'],{message:'Priority must be one of low, medium, or high'})
    priority?: string;

    @IsOptional()
    @IsDateString()
    dueDate?: Date;

}