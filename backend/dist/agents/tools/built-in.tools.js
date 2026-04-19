"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countCharactersTool = exports.reverseStringTool = exports.getCurrentTimeTool = exports.calculateTool = void 0;
const tools_1 = require("@langchain/core/tools");
exports.calculateTool = new tools_1.DynamicTool({
    name: 'calculator',
    description: 'Useful for mathematical calculations. Input should be a math expression.',
    func: async (input) => {
        try {
            const result = Function('"use strict"; return (' + input + ')')();
            return result.toString();
        }
        catch (error) {
            return `Error in calculation: ${error instanceof Error ? error.message : String(error)}`;
        }
    },
});
exports.getCurrentTimeTool = new tools_1.DynamicTool({
    name: 'get-current-time',
    description: 'Get the current date and time in ISO 8601 format',
    func: async () => {
        return new Date().toISOString();
    },
});
exports.reverseStringTool = new tools_1.DynamicTool({
    name: 'reverse-string',
    description: 'Reverses a given string',
    func: async (input) => {
        return input.split('').reverse().join('');
    },
});
exports.countCharactersTool = new tools_1.DynamicTool({
    name: 'count-characters',
    description: 'Counts the number of characters in a string',
    func: async (input) => {
        return input.length.toString();
    },
});
