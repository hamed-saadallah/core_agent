import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlignSchemaWithEntities1776798000000 implements MigrationInterface {
  name = 'AlignSchemaWithEntities1776798000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "plans" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "name" character varying(100) NOT NULL,
        "maxAgents" integer NOT NULL DEFAULT 10,
        CONSTRAINT "PK_plans_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      INSERT INTO "plans" ("name", "maxAgents")
      SELECT 'Free', 10
      WHERE NOT EXISTS (SELECT 1 FROM "plans" WHERE "name" = 'Free')
    `);

    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "isEmailVerified" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "profileId" uuid`);
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "planId" uuid`);

    await queryRunner.query(`ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "firstName" character varying(255)`);
    await queryRunner.query(`ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "lastName" character varying(255)`);
    await queryRunner.query(`ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "avatarUrl" character varying(500)`);
    await queryRunner.query(`ALTER TABLE "profiles" ALTER COLUMN "userId" DROP NOT NULL`);

    await queryRunner.query(`ALTER TABLE "email_verifications" ADD COLUMN IF NOT EXISTS "code" character varying(6)`);
    await queryRunner.query(`UPDATE "email_verifications" SET "code" = LEFT(COALESCE("code", "token", '000000'), 6) WHERE "code" IS NULL`);
    await queryRunner.query(`ALTER TABLE "email_verifications" ALTER COLUMN "code" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "email_verifications" DROP COLUMN IF EXISTS "email"`);
    await queryRunner.query(`ALTER TABLE "email_verifications" DROP COLUMN IF EXISTS "token"`);

    await queryRunner.query(`ALTER TABLE "chains" ADD COLUMN IF NOT EXISTS "startingPrompt" text NOT NULL DEFAULT ''`);
    await queryRunner.query(`ALTER TABLE "chains" ALTER COLUMN "description" SET NOT NULL`);

    await queryRunner.query(`ALTER TABLE "chain_nodes" ADD COLUMN IF NOT EXISTS "agentId" uuid`);
    await queryRunner.query(`ALTER TABLE "chain_nodes" ADD COLUMN IF NOT EXISTS "order" integer NOT NULL DEFAULT 0`);
    await queryRunner.query(`ALTER TABLE "chain_nodes" ADD COLUMN IF NOT EXISTS "nodeConfig" jsonb`);
    await queryRunner.query(`UPDATE "chain_nodes" SET "order" = COALESCE("position", 0)`);
    await queryRunner.query(`UPDATE "chain_nodes" SET "nodeConfig" = "config" WHERE "nodeConfig" IS NULL AND "config" IS NOT NULL`);
    await queryRunner.query(`ALTER TABLE "chain_nodes" ALTER COLUMN "position" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "chain_nodes" ALTER COLUMN "type" DROP NOT NULL`);

    await queryRunner.query(`ALTER TABLE "agent_runs" ADD COLUMN IF NOT EXISTS "userId" uuid`);
    await queryRunner.query(`ALTER TABLE "agent_runs" ADD COLUMN IF NOT EXISTS "executionTime" integer`);
    await queryRunner.query(`ALTER TABLE "agent_runs" ALTER COLUMN "agentId" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "agent_runs" ALTER COLUMN "input" TYPE jsonb USING to_jsonb("input")`);
    await queryRunner.query(`ALTER TABLE "agent_runs" ALTER COLUMN "output" TYPE jsonb USING to_jsonb("output")`);

    await queryRunner.query(`ALTER TABLE "chain_runs" ADD COLUMN IF NOT EXISTS "userId" uuid`);
    await queryRunner.query(`ALTER TABLE "chain_runs" ADD COLUMN IF NOT EXISTS "intermediateResults" jsonb NOT NULL DEFAULT '[]'::jsonb`);
    await queryRunner.query(`ALTER TABLE "chain_runs" ADD COLUMN IF NOT EXISTS "executionTime" integer`);
    await queryRunner.query(`ALTER TABLE "chain_runs" ALTER COLUMN "input" TYPE jsonb USING to_jsonb("input")`);
    await queryRunner.query(`ALTER TABLE "chain_runs" ALTER COLUMN "output" TYPE jsonb USING to_jsonb("output")`);

    await queryRunner.query(`ALTER TABLE "skills" ADD COLUMN IF NOT EXISTS "type" character varying(50) NOT NULL DEFAULT 'api_call'`);
    await queryRunner.query(`ALTER TABLE "skills" ADD COLUMN IF NOT EXISTS "config" jsonb NOT NULL DEFAULT '{}'::jsonb`);
    await queryRunner.query(`ALTER TABLE "skills" ADD COLUMN IF NOT EXISTS "inputSchema" jsonb NOT NULL DEFAULT '{}'::jsonb`);
    await queryRunner.query(`ALTER TABLE "skills" ADD COLUMN IF NOT EXISTS "outputSchema" jsonb NOT NULL DEFAULT '{}'::jsonb`);
    await queryRunner.query(`ALTER TABLE "skills" ADD COLUMN IF NOT EXISTS "status" character varying(50) NOT NULL DEFAULT 'active'`);
    await queryRunner.query(`ALTER TABLE "skills" ADD COLUMN IF NOT EXISTS "ownerId" uuid`);
    await queryRunner.query(`ALTER TABLE "skills" ADD COLUMN IF NOT EXISTS "retryConfig" jsonb`);
    await queryRunner.query(`ALTER TABLE "skills" ADD COLUMN IF NOT EXISTS "timeout" integer`);
    await queryRunner.query(`ALTER TABLE "skills" ALTER COLUMN "code" DROP NOT NULL`);

    await queryRunner.query(`ALTER TABLE "skill_runs" ADD COLUMN IF NOT EXISTS "userId" uuid`);
    await queryRunner.query(`ALTER TABLE "skill_runs" ADD COLUMN IF NOT EXISTS "agentRunId" uuid`);
    await queryRunner.query(`ALTER TABLE "skill_runs" ADD COLUMN IF NOT EXISTS "executionTime" integer`);
    await queryRunner.query(`ALTER TABLE "skill_runs" ADD COLUMN IF NOT EXISTS "retryCount" integer NOT NULL DEFAULT 0`);
    await queryRunner.query(`ALTER TABLE "skill_runs" ADD COLUMN IF NOT EXISTS "metadata" jsonb`);
    await queryRunner.query(`ALTER TABLE "skill_runs" ALTER COLUMN "input" TYPE jsonb USING to_jsonb("input")`);
    await queryRunner.query(`ALTER TABLE "skill_runs" ALTER COLUMN "output" TYPE jsonb USING to_jsonb("output")`);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'REL_users_profileId') THEN
          ALTER TABLE "users" ADD CONSTRAINT "REL_users_profileId" UNIQUE ("profileId");
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_users_profileId') THEN
          ALTER TABLE "users" ADD CONSTRAINT "FK_users_profileId" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_users_planId') THEN
          ALTER TABLE "users" ADD CONSTRAINT "FK_users_planId" FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_chain_nodes_agentId') THEN
          ALTER TABLE "chain_nodes" ADD CONSTRAINT "FK_chain_nodes_agentId" FOREIGN KEY ("agentId") REFERENCES "agents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_agent_runs_userId') THEN
          ALTER TABLE "agent_runs" ADD CONSTRAINT "FK_agent_runs_userId" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_chain_runs_userId') THEN
          ALTER TABLE "chain_runs" ADD CONSTRAINT "FK_chain_runs_userId" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_skill_runs_userId') THEN
          ALTER TABLE "skill_runs" ADD CONSTRAINT "FK_skill_runs_userId" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_skill_runs_agentRunId') THEN
          ALTER TABLE "skill_runs" ADD CONSTRAINT "FK_skill_runs_agentRunId" FOREIGN KEY ("agentRunId") REFERENCES "agent_runs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        END IF;
      END $$;
    `);

    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_agent_runs_agentId_createdAt" ON "agent_runs" ("agentId", "createdAt")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_agent_runs_userId_createdAt" ON "agent_runs" ("userId", "createdAt")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_chain_nodes_chainId_order" ON "chain_nodes" ("chainId", "order")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_chain_runs_chainId_createdAt" ON "chain_runs" ("chainId", "createdAt")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_chain_runs_userId_createdAt" ON "chain_runs" ("userId", "createdAt")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_skills_ownerId_status" ON "skills" ("ownerId", "status")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_skill_runs_skillId_createdAt" ON "skill_runs" ("skillId", "createdAt")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_skill_runs_userId_createdAt" ON "skill_runs" ("userId", "createdAt")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_skill_runs_agentRunId" ON "skill_runs" ("agentRunId")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_skill_runs_agentRunId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_skill_runs_userId_createdAt"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_skill_runs_skillId_createdAt"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_skills_ownerId_status"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_chain_runs_userId_createdAt"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_chain_runs_chainId_createdAt"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_chain_nodes_chainId_order"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_agent_runs_userId_createdAt"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_agent_runs_agentId_createdAt"`);

    await queryRunner.query(`ALTER TABLE "skill_runs" DROP COLUMN IF EXISTS "metadata"`);
    await queryRunner.query(`ALTER TABLE "skill_runs" DROP COLUMN IF EXISTS "retryCount"`);
    await queryRunner.query(`ALTER TABLE "skill_runs" DROP COLUMN IF EXISTS "executionTime"`);
    await queryRunner.query(`ALTER TABLE "skill_runs" DROP COLUMN IF EXISTS "agentRunId"`);
    await queryRunner.query(`ALTER TABLE "skill_runs" DROP COLUMN IF EXISTS "userId"`);

    await queryRunner.query(`ALTER TABLE "skills" DROP COLUMN IF EXISTS "timeout"`);
    await queryRunner.query(`ALTER TABLE "skills" DROP COLUMN IF EXISTS "retryConfig"`);
    await queryRunner.query(`ALTER TABLE "skills" DROP COLUMN IF EXISTS "ownerId"`);
    await queryRunner.query(`ALTER TABLE "skills" DROP COLUMN IF EXISTS "status"`);
    await queryRunner.query(`ALTER TABLE "skills" DROP COLUMN IF EXISTS "outputSchema"`);
    await queryRunner.query(`ALTER TABLE "skills" DROP COLUMN IF EXISTS "inputSchema"`);
    await queryRunner.query(`ALTER TABLE "skills" DROP COLUMN IF EXISTS "config"`);
    await queryRunner.query(`ALTER TABLE "skills" DROP COLUMN IF EXISTS "type"`);

    await queryRunner.query(`ALTER TABLE "chain_runs" DROP COLUMN IF EXISTS "executionTime"`);
    await queryRunner.query(`ALTER TABLE "chain_runs" DROP COLUMN IF EXISTS "intermediateResults"`);
    await queryRunner.query(`ALTER TABLE "chain_runs" DROP COLUMN IF EXISTS "userId"`);

    await queryRunner.query(`ALTER TABLE "agent_runs" DROP COLUMN IF EXISTS "executionTime"`);
    await queryRunner.query(`ALTER TABLE "agent_runs" DROP COLUMN IF EXISTS "userId"`);

    await queryRunner.query(`ALTER TABLE "chain_nodes" DROP COLUMN IF EXISTS "nodeConfig"`);
    await queryRunner.query(`ALTER TABLE "chain_nodes" DROP COLUMN IF EXISTS "order"`);
    await queryRunner.query(`ALTER TABLE "chain_nodes" DROP COLUMN IF EXISTS "agentId"`);

    await queryRunner.query(`ALTER TABLE "chains" DROP COLUMN IF EXISTS "startingPrompt"`);
    await queryRunner.query(`ALTER TABLE "email_verifications" DROP COLUMN IF EXISTS "code"`);
    await queryRunner.query(`ALTER TABLE "profiles" DROP COLUMN IF EXISTS "avatarUrl"`);
    await queryRunner.query(`ALTER TABLE "profiles" DROP COLUMN IF EXISTS "lastName"`);
    await queryRunner.query(`ALTER TABLE "profiles" DROP COLUMN IF EXISTS "firstName"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "planId"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "profileId"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "isEmailVerified"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "plans"`);
  }
}
