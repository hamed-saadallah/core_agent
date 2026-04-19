export declare enum LogLevelEnum {
    DEBUG = "debug",
    INFO = "info",
    WARN = "warn",
    ERROR = "error"
}
export declare class LoggerService {
    private logger;
    constructor();
    debug(message: string, context?: string, data?: any): void;
    log(message: string, context?: string, data?: any): void;
    warn(message: string, context?: string, data?: any): void;
    error(message: string, context?: string, error?: any): void;
}
