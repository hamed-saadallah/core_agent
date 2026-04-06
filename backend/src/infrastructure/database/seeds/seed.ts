import 'reflect-metadata';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { PlanEntity } from '../entities/plan.entity';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

async function runSeed(): Promise<void> {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'agent_core',
    entities: [path.join(__dirname, '../entities/**/*.entity{.ts,.js}')],
    synchronize: false,
    logging: true,
  });

  try {
    await dataSource.initialize();
    console.log('Database connection established');

    const planRepository = dataSource.getRepository(PlanEntity);

    const existingPlan = await planRepository.findOne({
      where: { name: 'Free' },
    });

    if (!existingPlan) {
      const freePlan = planRepository.create({
        name: 'Free',
        maxAgents: 10,
      });

      await planRepository.save(freePlan);
      console.log('Free plan seeded successfully');
    } else {
      console.log('Free plan already exists');
    }

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  } finally {
    await dataSource.destroy();
  }
}

runSeed();
