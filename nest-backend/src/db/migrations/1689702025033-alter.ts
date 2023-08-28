import { MigrationInterface, QueryRunner } from "typeorm";

export class Alter1689702025033 implements MigrationInterface {
    name = 'Alter1689702025033'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "userMetadataUserMetadataId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_eaf667c55ef07d734b33faedee7" UNIQUE ("userMetadataUserMetadataId")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_eaf667c55ef07d734b33faedee7" FOREIGN KEY ("userMetadataUserMetadataId") REFERENCES "user_metadata"("user_metadata_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_eaf667c55ef07d734b33faedee7"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_eaf667c55ef07d734b33faedee7"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "userMetadataUserMetadataId"`);
    }

}
