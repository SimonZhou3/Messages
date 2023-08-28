import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterUserTableCacasde1689796393665 implements MigrationInterface {
    name = 'AlterUserTableCacasde1689796393665'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_eaf667c55ef07d734b33faedee7"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_eaf667c55ef07d734b33faedee7" FOREIGN KEY ("userMetadataUserMetadataId") REFERENCES "user_metadata"("user_metadata_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_eaf667c55ef07d734b33faedee7"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_eaf667c55ef07d734b33faedee7" FOREIGN KEY ("userMetadataUserMetadataId") REFERENCES "user_metadata"("user_metadata_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
