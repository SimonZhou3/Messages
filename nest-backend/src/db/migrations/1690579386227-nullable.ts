import { MigrationInterface, QueryRunner } from "typeorm";

export class Nullable1690579386227 implements MigrationInterface {
    name = 'Nullable1690579386227'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_eaf667c55ef07d734b33faedee7"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_eaf667c55ef07d734b33faedee7"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "userMetadataUserMetadataId"`);
        await queryRunner.query(`ALTER TABLE "chat" ALTER COLUMN "chat_photo" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat" ALTER COLUMN "chat_photo" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "userMetadataUserMetadataId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_eaf667c55ef07d734b33faedee7" UNIQUE ("userMetadataUserMetadataId")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_eaf667c55ef07d734b33faedee7" FOREIGN KEY ("userMetadataUserMetadataId") REFERENCES "user_metadata"("user_metadata_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
