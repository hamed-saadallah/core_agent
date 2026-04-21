import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1776796497538 implements MigrationInterface {
    name = 'InitialSchema1776796497538'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "models" ALTER COLUMN "temperature" SET DEFAULT '0.7'`);
        await queryRunner.query(`ALTER TABLE "agents" ALTER COLUMN "temperature" SET DEFAULT '0.7'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "agents" ALTER COLUMN "temperature" SET DEFAULT 0.7`);
        await queryRunner.query(`ALTER TABLE "models" ALTER COLUMN "temperature" SET DEFAULT 0.7`);
    }

}
