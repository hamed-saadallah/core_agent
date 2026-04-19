"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const path = __importStar(require("path"));
const dotenv = __importStar(require("dotenv"));
const typeorm_1 = require("typeorm");
const plan_entity_1 = require("../entities/plan.entity");
// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
async function runSeed() {
    const dataSource = new typeorm_1.DataSource({
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
        console.log('Seeding completed successfully');
    }
    catch (error) {
        console.error('Seeding failed:', error);
        throw error;
    }
    finally {
        await dataSource.destroy();
    }
}
runSeed();
