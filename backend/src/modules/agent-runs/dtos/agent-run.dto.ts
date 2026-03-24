import { IsString, IsNotEmpty, IsOptional, IsJSON, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAgentRunDto {
  @ApiProperty({ description: 'Agent ID' })
  @IsUUID()
  @IsNotEmpty()
  agentId: string;

  @ApiProperty({ description: 'Run input' })
  @IsNotEmpty()
  input: any;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsOptional()
  metadata?: Record<string, any>;
}

export class QueryAgentRunsDto {
  @ApiPropertyOptional({ description: 'Agent ID filter' })
  @IsOptional()
  @IsUUID()
  agentId?: string;

  @ApiPropertyOptional({ description: 'Status filter' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Limit results' })
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ description: 'Skip results' })
  @IsOptional()
  skip?: number;
}
