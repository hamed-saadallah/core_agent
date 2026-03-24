import { DynamicTool } from '@langchain/core/tools';

export const calculateTool = new DynamicTool({
  name: 'calculator',
  description: 'Useful for mathematical calculations. Input should be a math expression.',
  func: async (input: string): Promise<string> => {
    try {
      const result = Function('"use strict"; return (' + input + ')')();
      return result.toString();
    } catch (error) {
      return `Error in calculation: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
});

export const getCurrentTimeTool = new DynamicTool({
  name: 'get-current-time',
  description: 'Get the current date and time in ISO 8601 format',
  func: async (): Promise<string> => {
    return new Date().toISOString();
  },
});

export const reverseStringTool = new DynamicTool({
  name: 'reverse-string',
  description: 'Reverses a given string',
  func: async (input: string): Promise<string> => {
    return input.split('').reverse().join('');
  },
});

export const countCharactersTool = new DynamicTool({
  name: 'count-characters',
  description: 'Counts the number of characters in a string',
  func: async (input: string): Promise<string> => {
    return input.length.toString();
  },
});
