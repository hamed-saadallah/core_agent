"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentNameOwnerUnique1712650000000 = void 0;
class AgentNameOwnerUnique1712650000000 {
    constructor() {
        this.name = 'AgentNameOwnerUnique1712650000000';
    }
    async up(queryRunner) {
        await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'UQ_2f2f8afbc0f8f00f89f0f8d6d0e'
            AND conrelid = 'agents'::regclass
        ) THEN
          ALTER TABLE "agents" DROP CONSTRAINT "UQ_2f2f8afbc0f8f00f89f0f8d6d0e";
        ELSIF EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'agents_name_key'
            AND conrelid = 'agents'::regclass
        ) THEN
          ALTER TABLE "agents" DROP CONSTRAINT "agents_name_key";
        END IF;
      END $$;
    `);
        await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'UQ_agents_name_owner_id'
            AND conrelid = 'agents'::regclass
        ) THEN
          ALTER TABLE "agents" ADD CONSTRAINT "UQ_agents_name_owner_id" UNIQUE ("name", "ownerId");
        END IF;
      END $$;
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'UQ_agents_name_owner_id'
            AND conrelid = 'agents'::regclass
        ) THEN
          ALTER TABLE "agents" DROP CONSTRAINT "UQ_agents_name_owner_id";
        END IF;
      END $$;
    `);
        await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'agents_name_key'
            AND conrelid = 'agents'::regclass
        ) THEN
          ALTER TABLE "agents" ADD CONSTRAINT "agents_name_key" UNIQUE ("name");
        END IF;
      END $$;
    `);
    }
}
exports.AgentNameOwnerUnique1712650000000 = AgentNameOwnerUnique1712650000000;
