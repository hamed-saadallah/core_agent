import { IsString, IsNotEmpty, IsOptional, IsJSON, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAgentDto {
  @ApiProperty({ description: 'Agent name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Agent description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ description: 'Agent configuration' })
  @IsOptional()
  config?: Record<string, any>;

  @ApiPropertyOptional({ description: 'LLM model name' })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({ description: 'Temperature for LLM' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(2)
  temperature?: number;

  @ApiPropertyOptional({ description: 'Tool IDs to assign' })
  @IsOptional()
  toolIds?: string[];

  @ApiPropertyOptional({ description: 'Prompt ID' })
  @IsOptional()
  @IsString()
  promptId?: string;
}

export class UpdateAgentDto {
  @ApiPropertyOptional({ description: 'Agent name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Agent description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Agent status' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Agent configuration' })
  @IsOptional()
  config?: Record<string, any>;

  @ApiPropertyOptional({ description: 'LLM model name' })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({ description: 'Temperature for LLM' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(2)
  temperature?: number;

  @ApiPropertyOptional({ description: 'Tool IDs to assign' })
  @IsOptional()
  toolIds?: string[];

  @ApiPropertyOptional({ description: 'Prompt ID' })
  @IsOptional()
  @IsString()
  promptId?: string;
}

export class ExecuteAgentDto {
  @ApiProperty({ description: 'Agent input/query' })
  @IsNotEmpty()
  input: any;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsOptional()
  metadata?: Record<string, any>;
}
