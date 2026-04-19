export declare class AgentException extends Error {
    readonly code: string;
    constructor(message: string, code?: string);
}
export declare class ToolException extends Error {
    readonly code: string;
    constructor(message: string, code?: string);
}
export declare class ValidationException extends Error {
    readonly code: string;
    constructor(message: string, code?: string);
}
export declare class NotFoundException extends Error {
    readonly code: string;
    constructor(message: string, code?: string);
}
export declare class UnauthorizedException extends Error {
    readonly code: string;
    constructor(message: string, code?: string);
}
