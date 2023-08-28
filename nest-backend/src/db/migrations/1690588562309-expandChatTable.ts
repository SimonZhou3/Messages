import { MigrationInterface, QueryRunner } from "typeorm";

export class ExpandChatTable1690588562309 implements MigrationInterface {
    name = 'ExpandChatTable1690588562309'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" ADD "message" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "message"`);
    }

}
