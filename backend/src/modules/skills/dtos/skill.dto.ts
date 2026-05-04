import { IsString, IsOptional, IsObject, IsNumber, IsUUID } from 'class-validator';

export class CreateSkillDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  type:
    | 'api_call'
    | 'web_search'
    | 'document_parse'
    | 'data_transform'
    | 'external_service'
    | 'salesforce_case';

  @IsObject()
  config: Record<string, any>;

  @IsObject()
  inputSchema: Record<string, any>;

  @IsObject()
  outputSchema: Record<string, any>;

  @IsOptional()
  @IsObject()
  retryConfig?: {
    maxRetries: number;
    backoffMs: number;
    retryOn: string[];
  };

  @IsOptional()
  @IsNumber()
  timeout?: number;
}

export class UpdateSkillDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  config?: Record<string, any>;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsObject()
  retryConfig?: {
    maxRetries: number;
    backoffMs: number;
    retryOn: string[];
  };

  @IsOptional()
  @IsNumber()
  timeout?: number;
}

export class ExecuteSkillDto {
  @IsObject()
  input: Record<string, any>;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  /** When set, Salesforce case skills use this agent's model and API key */
  @IsOptional()
  @IsUUID()
  agentId?: string;
}

export class QuerySkillsDto {
  @IsOptional()
  @IsNumber()
  skip?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  type?: string;
}
