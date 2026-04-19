export enum NodeEnvironment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
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

export const getEnvironmentVariables = (): Partial<EnvironmentVariables> => ({
  NODE_ENV: (process.env.NODE_ENV as NodeEnvironment) || NodeEnvironment.DEVELOPMENT,
  PORT: parseInt(process.env.PORT || '3000', 10),
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT || '5432', 10),
  DB_USERNAME: process.env.DB_USERNAME || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || 'postgres',
  DB_NAME: process.env.DB_NAME || 'agent_core',
  DB_SSL: process.env.DB_SSL === 'true' || process.env.DB_SSL === '1',
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379', 10),
  JWT_SECRET: process.env.JWT_SECRET || 'secret-key',
  JWT_EXPIRATION: parseInt(process.env.JWT_EXPIRATION || '3600', 10),
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  LANGCHAIN_API_KEY: process.env.LANGCHAIN_API_KEY || '',
  LOG_LEVEL: (process.env.LOG_LEVEL as LogLevel) || LogLevel.INFO,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3001',
});

