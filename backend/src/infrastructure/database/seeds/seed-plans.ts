import { DataSource } from 'typeorm';
import { PlanEntity } from '../entities/plan.entity';

export async function seedPlans(dataSource: DataSource): Promise<void> {
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
}
