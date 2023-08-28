import { MigrationInterface, QueryRunner } from "typeorm";

export class ExpandChatTable1690587263046 implements MigrationInterface {
    name = 'ExpandChatTable1690587263046'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat" DROP COLUMN "created_at"`);
    }

}
