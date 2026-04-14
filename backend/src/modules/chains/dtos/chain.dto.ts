import { IsString, IsOptional, IsArray, IsNumber, IsObject } from 'class-validator';

export class CreateChainDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  startingPrompt: string;

  @IsOptional()
  @IsObject()
  config?: Record<string, any>;
}

export class UpdateChainDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  startingPrompt?: string;

  @IsOptional()
  @IsObject()
  config?: Record<string, any>;
}

export class AddChainNodeDto {
  @IsString()
  agentId: string;

  @IsNumber()
  order: number;

  @IsOptional()
  @IsObject()
  nodeConfig?: Record<string, any>;
}

export class UpdateChainNodeDto {
  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsObject()
  nodeConfig?: Record<string, any>;
}

export class ExecuteChainDto {
  @IsObject()
  parameters: Record<string, any>;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class QueryChainsDto {
  @IsOptional()
  @IsNumber()
  skip?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsString()
  status?: string;
}

export class QueryChainRunsDto {
  @IsOptional()
  @IsNumber()
  skip?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsString()
  status?: string;
}
