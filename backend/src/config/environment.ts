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
  DATABASE_HOST: string;
  DATABASE_PORT: number;
  DATABASE_USER: string;
  DATABASE_PASSWORD: string;
  DATABASE_NAME: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
  JWT_SECRET: string;
  JWT_EXPIRATION: number;
  OPENAI_API_KEY: string;
  LANGCHAIN_API_KEY: string;
  LOG_LEVEL: LogLevel;
}

export const getEnvironmentVariables = (): Partial<EnvironmentVariables> => ({
  NODE_ENV: (process.env.NODE_ENV as NodeEnvironment) || NodeEnvironment.DEVELOPMENT,
  PORT: parseInt(process.env.PORT || '3000', 10),
  DATABASE_HOST: process.env.DATABASE_HOST || 'localhost',
  DATABASE_PORT: parseInt(process.env.DATABASE_PORT || '5432', 10),
  DATABASE_USER: process.env.DATABASE_USER || 'postgres',
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || 'postgres',
  DATABASE_NAME: process.env.DATABASE_NAME || 'agent_core',
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379', 10),
  JWT_SECRET: process.env.JWT_SECRET || 'secret-key',
  JWT_EXPIRATION: parseInt(process.env.JWT_EXPIRATION || '3600', 10),
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  LANGCHAIN_API_KEY: process.env.LANGCHAIN_API_KEY || '',
  LOG_LEVEL: (process.env.LOG_LEVEL as LogLevel) || LogLevel.INFO,
});
