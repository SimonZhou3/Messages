import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeMessageTable1690669775405 implements MigrationInterface {
    name = 'ChangeMessageTable1690669775405'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" ALTER COLUMN "images" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" ALTER COLUMN "images" SET NOT NULL`);
    }

}
