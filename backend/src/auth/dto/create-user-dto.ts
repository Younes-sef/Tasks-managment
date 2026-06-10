import { IsNotEmpty, IsOptional, IsEnum, IsString, IsDateString } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
  @IsNotEmpty()
  @IsEnum(['admin','user'],{message:'Role must be one of admin or user'})
  readonly role: string;

  
}