import { MigrationInterface, QueryRunner } from "typeorm";

export class NullableName1690579524755 implements MigrationInterface {
    name = 'NullableName1690579524755'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat" ALTER COLUMN "chat_name" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat" ALTER COLUMN "chat_name" SET NOT NULL`);
    }

}
