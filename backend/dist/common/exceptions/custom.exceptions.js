"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedException = exports.NotFoundException = exports.ValidationException = exports.ToolException = exports.AgentException = void 0;
class AgentException extends Error {
    constructor(message, code = 'AGENT_ERROR') {
        super(message);
        this.code = code;
        this.name = 'AgentException';
    }
}
exports.AgentException = AgentException;
class ToolException extends Error {
    constructor(message, code = 'TOOL_ERROR') {
        super(message);
        this.code = code;
        this.name = 'ToolException';
    }
}
exports.ToolException = ToolException;
class ValidationException extends Error {
    constructor(message, code = 'VALIDATION_ERROR') {
        super(message);
        this.code = code;
        this.name = 'ValidationException';
    }
}
exports.ValidationException = ValidationException;
class NotFoundException extends Error {
    constructor(message, code = 'NOT_FOUND') {
        super(message);
        this.code = code;
        this.name = 'NotFoundException';
    }
}
exports.NotFoundException = NotFoundException;
class UnauthorizedException extends Error {
    constructor(message, code = 'UNAUTHORIZED') {
        super(message);
        this.code = code;
        this.name = 'UnauthorizedException';
    }
}
exports.UnauthorizedException = UnauthorizedException;
