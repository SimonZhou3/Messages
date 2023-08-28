import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterUserTable1689702266468 implements MigrationInterface {
    name = 'AlterUserTable1689702266468'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "oauth_authenticated" SET DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "oauth_authenticated" DROP DEFAULT`);
    }

}
