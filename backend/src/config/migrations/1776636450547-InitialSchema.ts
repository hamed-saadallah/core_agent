import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1776636450547 implements MigrationInterface {
    name = 'InitialSchema1776636450547'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "agents" ALTER COLUMN "temperature" SET DEFAULT '0.7'`);
        await queryRunner.query(`ALTER TABLE "models" ALTER COLUMN "temperature" SET DEFAULT '0.7'`);
        await queryRunner.query(`ALTER TABLE "tools" ALTER COLUMN "isActive" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "prompts" ALTER COLUMN "isActive" SET DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "agents" ALTER COLUMN "temperature" SET DEFAULT 0.7`);
        await queryRunner.query(`ALTER TABLE "models" ALTER COLUMN "temperature" SET DEFAULT 0.7`);
        await queryRunner.query(`ALTER TABLE "tools" ALTER COLUMN "isActive" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "prompts" ALTER COLUMN "isActive" SET DEFAULT false`);
    }

}
