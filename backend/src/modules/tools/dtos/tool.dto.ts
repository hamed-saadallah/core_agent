import { IsString, IsNotEmpty, IsOptional, IsJSON } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateToolDto {
  @ApiProperty({ description: 'Tool name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Tool description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Tool schema' })
  schema: Record<string, any>;

  @ApiPropertyOptional({ description: 'Tool category' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Tool configuration' })
  @IsOptional()
  config?: Record<string, any>;
}

export class UpdateToolDto {
  @ApiPropertyOptional({ description: 'Tool name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Tool description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Tool schema' })
  @IsOptional()
  schema?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Tool category' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Tool is active' })
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Tool configuration' })
  @IsOptional()
  config?: Record<string, any>;
}
