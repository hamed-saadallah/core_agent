import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

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
      username: decodeURIComponent(url.username || 'postgres'),
      password: decodeURIComponent(url.password || 'postgres'),
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
const nodeEnv = process.env.NODE_ENV || 'development';
const dbSslString = process.env.DB_SSL || (nodeEnv === 'production' ? 'true' : 'false');
const sslEnabled = dbSslString === 'true' || dbSslString === '1';

export default new DataSource({
  type: 'postgres',
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  entities: [path.join(__dirname, '..', '**', '*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, 'migrations', '*{.ts,.js}')],
  subscribers: [path.join(__dirname, '..', '**', '*.subscriber{.ts,.js}')],
  synchronize: false,
  logging: nodeEnv !== 'production',
  ssl: sslEnabled ? { rejectUnauthorized: false } : false,
});
