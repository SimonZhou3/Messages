import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveMessageColumns1690588959520 implements MigrationInterface {
    name = 'RemoveMessageColumns1690588959520'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "chat_name"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "chat_photo"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" ADD "chat_photo" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "chat_name" character varying NOT NULL`);
    }

}
