export class AgentException extends Error {
  constructor(message: string, public readonly code: string = 'AGENT_ERROR') {
    super(message);
    this.name = 'AgentException';
  }
}

export class ToolException extends Error {
  constructor(message: string, public readonly code: string = 'TOOL_ERROR') {
    super(message);
    this.name = 'ToolException';
  }
}

export class ValidationException extends Error {
  constructor(message: string, public readonly code: string = 'VALIDATION_ERROR') {
    super(message);
    this.name = 'ValidationException';
  }
}

export class NotFoundException extends Error {
  constructor(message: string, public readonly code: string = 'NOT_FOUND') {
    super(message);
    this.name = 'NotFoundException';
  }
}

export class UnauthorizedException extends Error {
  constructor(message: string, public readonly code: string = 'UNAUTHORIZED') {
    super(message);
    this.name = 'UnauthorizedException';
  }
}
