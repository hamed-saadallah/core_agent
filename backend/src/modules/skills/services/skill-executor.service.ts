import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { SkillRunEntity } from '@/infrastructure/database/entities/skill-run.entity';
import { SkillEntity } from '@/infrastructure/database/entities/skill.entity';
import { SkillRunsService } from './skill-runs.service';

@Injectable()
export class SkillExecutorService {
  private readonly logger = new Logger(SkillExecutorService.name);

  constructor(private skillRunsService: SkillRunsService) {}

  async executeSkill(skill: SkillEntity, input: Record<string, any>, skillRun: SkillRunEntity): Promise<any> {
    this.logger.log(`Executing skill: ${skill.name} (type: ${skill.type})`);

    const startTime = Date.now();
    let result: any;

    try {
      await this.skillRunsService.updateStatus(skillRun.id, 'running');

      switch (skill.type) {
        case 'api_call':
          result = await this.executeApiCall(skill.config, input);
          break;
        case 'web_search':
          result = await this.executeWebSearch(skill.config, input);
          break;
        case 'document_parse':
          result = await this.executeDocumentParse(skill.config, input);
          break;
        case 'data_transform':
          result = await this.executeDataTransform(skill.config, input);
          break;
        case 'external_service':
          result = await this.executeExternalService(skill.config, input);
          break;
        default:
          throw new BadRequestException(`Unknown skill type: ${skill.type}`);
      }

      const executionTime = Date.now() - startTime;
      await this.skillRunsService.updateStatus(skillRun.id, 'completed', result, undefined, executionTime);

      return result;
    } catch (error) {
      const executionTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);

      // Check if we should retry
      if (skill.retryConfig && skillRun.retryCount < skill.retryConfig.maxRetries) {
        this.logger.warn(`Skill execution failed, attempting retry. Attempt ${skillRun.retryCount + 1}/${skill.retryConfig.maxRetries}`);

        await this.skillRunsService.incrementRetry(skillRun.id);

        // Calculate backoff
        const backoffDelay = skill.retryConfig.backoffMs * Math.pow(2, skillRun.retryCount);

        // Check if error should trigger retry
        const shouldRetry = skill.retryConfig.retryOn.length === 0 || skill.retryConfig.retryOn.some((pattern) => errorMessage.includes(pattern));

        if (shouldRetry) {
          this.logger.log(`Waiting ${backoffDelay}ms before retry...`);
          await this.delay(backoffDelay);

          // Recursively retry
          const updatedRun = await this.skillRunsService.updateStatus(skillRun.id, 'retried', undefined, undefined, executionTime);
          return this.executeSkill(skill, input, updatedRun);
        }
      }

      // Final failure
      await this.skillRunsService.updateStatus(skillRun.id, 'failed', undefined, errorMessage, executionTime);
      throw new BadRequestException(`Skill execution failed: ${errorMessage}`);
    }
  }

  private async executeApiCall(config: Record<string, any>, input: Record<string, any>): Promise<any> {
    this.logger.debug('Executing API call skill');

    const { method = 'GET', url, headers = {}, authType, authConfig } = config;

    if (!url) {
      throw new BadRequestException('API skill must have a URL configured');
    }

    const requestHeaders: Record<string, string> = { ...headers };

    // Add authentication if configured
    if (authType === 'bearer' && authConfig?.token) {
      requestHeaders['Authorization'] = `Bearer ${authConfig.token}`;
    } else if (authType === 'api_key' && authConfig?.key && authConfig?.headerName) {
      requestHeaders[authConfig.headerName] = authConfig.key;
    }

    try {
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: method !== 'GET' ? JSON.stringify(input) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      this.logger.error(`API call failed: ${error}`);
      throw error;
    }
  }

  private async executeWebSearch(config: Record<string, any>, input: Record<string, any>): Promise<any> {
    this.logger.debug('Executing web search skill');

    const { provider = 'google', apiKey, searchParams = {} } = config;
    const { query } = input;

    if (!query) {
      throw new BadRequestException('Web search skill requires "query" in input');
    }

    if (!apiKey) {
      throw new BadRequestException('Web search skill must have an API key configured');
    }

    // This is a placeholder implementation
    // In production, you'd integrate with Google Search API, Bing, etc.
    this.logger.warn(`Web search not fully implemented for provider: ${provider}`);

    return {
      provider,
      query,
      results: [],
      message: 'Web search implementation pending',
    };
  }

  private async executeDocumentParse(config: Record<string, any>, input: Record<string, any>): Promise<any> {
    this.logger.debug('Executing document parse skill');

    const { format, parseRules = {} } = config;
    const { content, documentPath } = input;

    if (!content && !documentPath) {
      throw new BadRequestException('Document parse skill requires "content" or "documentPath" in input');
    }

    // This is a placeholder implementation
    // In production, you'd use libraries like pdf-parse, xml2js, etc.
    this.logger.warn(`Document parse not fully implemented for format: ${format}`);

    return {
      format,
      parsed: true,
      content: content || documentPath,
      rules: parseRules,
      message: 'Document parse implementation pending',
    };
  }

  private async executeDataTransform(config: Record<string, any>, input: Record<string, any>): Promise<any> {
    this.logger.debug('Executing data transform skill');

    const { mappings = {} } = config;

    // Simple mapping transformation
    const result: Record<string, any> = {};

    for (const [outputKey, inputPath] of Object.entries(mappings)) {
      result[outputKey] = this.getNestedValue(input, inputPath as string);
    }

    return result;
  }

  private async executeExternalService(config: Record<string, any>, input: Record<string, any>): Promise<any> {
    this.logger.debug('Executing external service skill');

    const { serviceName, endpoint, method = 'POST' } = config;

    if (!serviceName || !endpoint) {
      throw new BadRequestException('External service skill must have serviceName and endpoint configured');
    }

    // This is a placeholder implementation
    // In production, you'd implement service-specific integrations
    this.logger.warn(`External service not fully implemented for: ${serviceName}`);

    return {
      serviceName,
      endpoint,
      input,
      message: 'External service execution pending',
    };
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
