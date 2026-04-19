"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedPlans = seedPlans;
const plan_entity_1 = require("../entities/plan.entity");
async function seedPlans(dataSource) {
    const planRepository = dataSource.getRepository(plan_entity_1.PlanEntity);
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
    }
    else {
        console.log('Free plan already exists');
    }
}
