"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvironmentVariables = exports.LogLevel = exports.NodeEnvironment = void 0;
var NodeEnvironment;
(function (NodeEnvironment) {
    NodeEnvironment["DEVELOPMENT"] = "development";
    NodeEnvironment["PRODUCTION"] = "production";
    NodeEnvironment["TEST"] = "test";
})(NodeEnvironment || (exports.NodeEnvironment = NodeEnvironment = {}));
var LogLevel;
(function (LogLevel) {
    LogLevel["DEBUG"] = "debug";
    LogLevel["INFO"] = "info";
    LogLevel["WARN"] = "warn";
    LogLevel["ERROR"] = "error";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
const getEnvironmentVariables = () => ({
    NODE_ENV: process.env.NODE_ENV || NodeEnvironment.DEVELOPMENT,
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
    LOG_LEVEL: process.env.LOG_LEVEL || LogLevel.INFO,
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3001',
});
exports.getEnvironmentVariables = getEnvironmentVariables;
