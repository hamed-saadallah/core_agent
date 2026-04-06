import { IsString, IsNotEmpty, IsOptional, IsJSON, IsNumber, IsUUID, Min, Max } from 'class-validator';
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

  @ApiProperty({ description: 'Model ID' })
  @IsUUID()
  @IsNotEmpty()
  modelId: string;

  @ApiPropertyOptional({ description: 'Agent configuration' })
  @IsOptional()
  config?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Temperature for LLM (deprecated, use model temperature)' })
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

  @ApiPropertyOptional({ description: 'Prompt template with parameter placeholders like {param}' })
  @IsOptional()
  @IsString()
  promptTemplate?: string;
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

  @ApiPropertyOptional({ description: 'Model ID' })
  @IsOptional()
  @IsUUID()
  modelId?: string;

  @ApiPropertyOptional({ description: 'Agent configuration' })
  @IsOptional()
  config?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Temperature for LLM (deprecated, use model temperature)' })
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

  @ApiPropertyOptional({ description: 'Prompt template with parameter placeholders like {param}' })
  @IsOptional()
  @IsString()
  promptTemplate?: string;
}

export class ExecuteAgentDto {
  @ApiProperty({ description: 'Agent input/query' })
  @IsNotEmpty()
  input: any;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsOptional()
  metadata?: Record<string, any>;
}

export class ExecuteAgentWithParametersDto {
  @ApiProperty({ description: 'Parameters to fill template placeholders' })
  @IsNotEmpty()
  parameters: Record<string, string>;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsOptional()
  metadata?: Record<string, any>;
}
