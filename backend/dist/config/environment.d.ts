export declare enum NodeEnvironment {
    DEVELOPMENT = "development",
    PRODUCTION = "production",
    TEST = "test"
}
export declare enum LogLevel {
    DEBUG = "debug",
    INFO = "info",
    WARN = "warn",
    ERROR = "error"
}
export interface EnvironmentVariables {
    NODE_ENV: NodeEnvironment;
    PORT: number;
    DB_HOST: string;
    DB_PORT: number;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    DB_SSL: boolean;
    REDIS_HOST: string;
    REDIS_PORT: number;
    JWT_SECRET: string;
    JWT_EXPIRATION: number;
    OPENAI_API_KEY: string;
    LANGCHAIN_API_KEY: string;
    LOG_LEVEL: LogLevel;
    FRONTEND_URL: string;
}
export declare const getEnvironmentVariables: () => Partial<EnvironmentVariables>;
