import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

// Load .env file for CLI usage
dotenv.config({ path: '.env' });

// Parse DATABASE_URL if provided, otherwise use individual variables
function getDatabaseConfig() {
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl) {
    // Parse DATABASE_URL format: postgresql://username:password@host:port/database
    const url = new URL(databaseUrl);
    return {
      host: url.hostname || 'localhost',
      port: parseInt(url.port || '5432', 10),
      username: url.username || 'postgres',
      password: url.password || 'postgres',
      database: url.pathname?.slice(1) || 'agent_core',
    };
  }

  // Fall back to individual environment variables
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'agent_core',
  };
}

const dbConfig = getDatabaseConfig();

export default new DataSource({
  type: 'postgres',
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/config/migrations/*.ts'],
  subscribers: ['src/**/*.subscriber.ts'],
  synchronize: false,
  logging: false,
  ssl:
    process.env.DB_SSL === 'true'
      ? { rejectUnauthorized: false }
      : false,
});
