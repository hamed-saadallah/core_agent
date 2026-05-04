import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { Connection } from 'jsforce';
import { ChatOpenAI } from '@langchain/openai';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { HumanMessage, AIMessage, ToolMessage } from '@langchain/core/messages';
import { z } from 'zod';
import { SkillEntity } from '@/infrastructure/database/entities/skill.entity';

export interface SalesforceCaseSkillLlmContext {
  modelName: string;
  apiKey: string;
  temperature?: number;
}

const CASE_STANDARD_FIELDS = [
  'Subject',
  'Description',
  'Status',
  'Priority',
  'Origin',
  'Reason',
  'Type',
] as const;

@Injectable()
export class SalesforceCaseSkillService {
  private readonly logger = new Logger(SalesforceCaseSkillService.name);

  async execute(
    skill: SkillEntity,
    input: Record<string, any>,
    llmContext?: SalesforceCaseSkillLlmContext,
  ): Promise<Record<string, any>> {
    const instruction =
      typeof input.instruction === 'string'
        ? input.instruction
        : typeof input.query === 'string'
          ? input.query
          : typeof input.userMessage === 'string'
            ? input.userMessage
            : null;

    if (!instruction?.trim()) {
      throw new BadRequestException(
        'Salesforce case skill requires natural language input (instruction, query, or userMessage)',
      );
    }

    const { loginUrl, username, password } = this.parseSalesforceConfig(skill.config);

    const apiKey = llmContext?.apiKey ?? process.env.OPENAI_API_KEY;
    const modelName = llmContext?.modelName ?? process.env.SALESFORCE_CASE_SKILL_MODEL ?? 'gpt-4o-mini';

    if (!apiKey) {
      throw new BadRequestException(
        'No LLM API key available. Run this skill from an agent with a model, or set OPENAI_API_KEY for manual skill runs.',
      );
    }

    const conn = new Connection({ loginUrl });
    await conn.login(username, password);
    this.logger.log(`Salesforce login succeeded for user ${username}`);

    try {
      const tools = this.buildTools(conn);
      const llm = new ChatOpenAI({
        modelName,
        temperature: llmContext?.temperature ?? 0.1,
        openAIApiKey: apiKey,
      });
      const modelWithTools = llm.bindTools(tools);

      const systemPreamble = `You manage Salesforce Cases using tools only when the user wants to create or update a case.
Standard Case fields: ${CASE_STANDARD_FIELDS.join(', ')}.
For updates you need the Salesforce Case Id from the user or from a tool result.
If intent is unclear, reply with one short question and do not call tools.`;

      const messages: (HumanMessage | AIMessage | ToolMessage)[] = [
        new HumanMessage(`${systemPreamble}\n\nUser request:\n${instruction}`),
      ];

      const maxSteps = 8;
      const toolSteps: Array<{ name: string; args: unknown; result: string }> = [];

      for (let step = 0; step < maxSteps; step++) {
        const ai = (await modelWithTools.invoke(messages)) as AIMessage;
        messages.push(ai);

        const toolCalls = (ai as any).tool_calls as Array<{ id?: string; name: string; args: Record<string, unknown> }> | undefined;
        if (!toolCalls?.length) {
          const text =
            typeof ai.content === 'string'
              ? ai.content
              : Array.isArray(ai.content)
                ? ai.content.map((c: any) => (typeof c?.text === 'string' ? c.text : '')).join('')
                : JSON.stringify(ai.content);
          return {
            output: text,
            toolSteps,
          };
        }

        for (const tc of toolCalls) {
          const tool = tools.find((t) => t.name === tc.name);
          if (!tool) {
            const msg = `Unknown tool: ${tc.name}`;
            messages.push(
              new ToolMessage({
                content: msg,
                tool_call_id: tc.id ?? `call_${tc.name}_${step}`,
              }),
            );
            continue;
          }
          let resultStr: string;
          try {
            const out = await tool.invoke(tc.args ?? {});
            resultStr = typeof out === 'string' ? out : JSON.stringify(out);
          } catch (err) {
            resultStr = JSON.stringify({
              error: err instanceof Error ? err.message : String(err),
            });
          }
          toolSteps.push({ name: tc.name, args: tc.args, result: resultStr });
          messages.push(
            new ToolMessage({
              content: resultStr,
              tool_call_id: tc.id ?? `call_${tc.name}_${step}`,
            }),
          );
        }
      }

      return {
        output: 'Stopped after maximum tool-calling steps.',
        toolSteps,
      };
    } finally {
      try {
        await conn.logout();
      } catch {
        // ignore logout errors
      }
    }
  }

  private parseSalesforceConfig(config: Record<string, any>): { loginUrl: string; username: string; password: string } {
    if (!config || typeof config !== 'object') {
      throw new BadRequestException('Salesforce case skill config must be a JSON object');
    }

    const loginUrl =
      typeof config.loginUrl === 'string' && config.loginUrl.trim()
        ? config.loginUrl.trim()
        : 'https://login.salesforce.com';

    const username = typeof config.username === 'string' ? config.username.trim() : '';
    const password = typeof config.password === 'string' ? config.password : '';

    if (!username || !password) {
      throw new BadRequestException(
        'Salesforce case skill config requires "username" and "password" (password must include the security token per Salesforce requirements)',
      );
    }

    return { loginUrl, username, password };
  }

  private buildTools(conn: Connection): DynamicStructuredTool[] {
    const createCaseSchema = z.object({
      Subject: z.string().describe('Case subject (required)'),
      Description: z.string().optional().describe('Case description / details'),
      Status: z.string().optional().describe('e.g. New, Working, Escalated, Closed'),
      Priority: z.string().optional().describe('e.g. Low, Medium, High'),
      Origin: z.string().optional().describe('e.g. Web, Phone, Email'),
    });

    const updateCaseSchema = z.object({
      caseId: z.string().describe('Salesforce Case Id to update'),
      Subject: z.string().optional(),
      Description: z.string().optional(),
      Status: z.string().optional(),
      Priority: z.string().optional(),
      Origin: z.string().optional(),
    });

    const createTool = new DynamicStructuredTool({
      name: 'create_salesforce_case',
      description: 'Create a new Salesforce Case with standard fields only.',
      schema: createCaseSchema,
      func: async (fields) => {
        const record: Record<string, string> = {};
        for (const key of CASE_STANDARD_FIELDS) {
          const v = (fields as Record<string, unknown>)[key];
          if (v !== undefined && v !== null && String(v).trim() !== '') {
            record[key] = String(v).trim();
          }
        }
        if (!record.Subject) {
          return JSON.stringify({ success: false, error: 'Subject is required to create a Case' });
        }
        const results = await conn.sobject('Case').create(record);
        const r = results as { success?: boolean; id?: string; errors?: unknown };
        if (r.success) {
          return JSON.stringify({ success: true, id: r.id });
        }
        return JSON.stringify({ success: false, errors: r.errors ?? results });
      },
    });

    const updateTool = new DynamicStructuredTool({
      name: 'update_salesforce_case',
      description: 'Update an existing Salesforce Case by Id using standard fields only.',
      schema: updateCaseSchema,
      func: async (fields) => {
        const { caseId, ...rest } = fields;
        const record: Record<string, string> = { Id: caseId.trim() };
        for (const key of CASE_STANDARD_FIELDS) {
          const v = (rest as Record<string, unknown>)[key];
          if (v !== undefined && v !== null && String(v).trim() !== '') {
            record[key] = String(v).trim();
          }
        }
        if (Object.keys(record).length <= 1) {
          return JSON.stringify({ success: false, error: 'No fields to update besides Id' });
        }
        const results = await conn.sobject('Case').update(record as { Id: string } & Record<string, string>);
        const r = results as { success?: boolean; id?: string; errors?: unknown };
        if (r.success) {
          return JSON.stringify({ success: true, id: r.id ?? caseId });
        }
        return JSON.stringify({ success: false, errors: r.errors ?? results });
      },
    });

    return [createTool, updateTool];
  }
}
