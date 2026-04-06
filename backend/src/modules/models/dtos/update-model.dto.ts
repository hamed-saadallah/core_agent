import { IsString, IsNotEmpty, IsNumber, IsOptional, IsIn } from 'class-validator';

export class UpdateModelDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  version?: string;

  @IsString()
  @IsOptional()
  apiKey?: string;

  @IsNumber()
  @IsOptional()
  temperature?: number;

  @IsString()
  @IsOptional()
  @IsIn(['enabled', 'disabled'])
  status?: string;
}
