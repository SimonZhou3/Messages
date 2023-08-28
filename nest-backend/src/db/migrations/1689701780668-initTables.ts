import { MigrationInterface, QueryRunner } from "typeorm";

export class InitTables1689701780668 implements MigrationInterface {
    name = 'InitTables1689701780668'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."chat_chat_type_enum" AS ENUM('private', 'group')`);
        await queryRunner.query(`CREATE TABLE "chat" ("chat_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "chat_name" character varying NOT NULL, "chat_type" "public"."chat_chat_type_enum" NOT NULL, "chat_photo" character varying NOT NULL, CONSTRAINT "PK_415c34dcb5ad6193a9ea9dab25e" PRIMARY KEY ("chat_id"))`);
        await queryRunner.query(`CREATE TABLE "messages" ("message_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "chat_name" character varying NOT NULL, "chat_photo" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "seen" boolean NOT NULL, "images" text array NOT NULL, "chatChatId" uuid, "userUserId" uuid, CONSTRAINT "PK_6187089f850b8deeca0232cfeba" PRIMARY KEY ("message_id"))`);
        await queryRunner.query(`CREATE TABLE "contact" ("contact_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "userUserId" uuid, "contactUserUserId" uuid, CONSTRAINT "PK_b77c91f220387c3c90df787bce5" PRIMARY KEY ("contact_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1a2925ea113195a66e0e77cf38" ON "contact" ("userUserId", "contactUserUserId") `);
        await queryRunner.query(`CREATE TABLE "user" ("user_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "oauth_authenticated" boolean NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_758b8ce7c18b9d347461b30228d" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE TABLE "notification" ("notification_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "message" character varying NOT NULL, "status" character varying NOT NULL, "userUserId" uuid, CONSTRAINT "PK_fc4db99eb33f32cea47c5b6a39c" PRIMARY KEY ("notification_id"))`);
        await queryRunner.query(`CREATE TABLE "user_metadata" ("user_metadata_id" SERIAL NOT NULL, "biography" character varying, "location" character varying, "online_status" character varying, "avatar" character varying, "cover_photo" character varying, "username" character varying NOT NULL, "userUserId" uuid, CONSTRAINT "UQ_615940fadda0a583058289531d7" UNIQUE ("username"), CONSTRAINT "REL_20236bcc5432d8e00b29d02bcf" UNIQUE ("userUserId"), CONSTRAINT "PK_ad16dae527987e02b99dc6d72e8" PRIMARY KEY ("user_metadata_id"))`);
        await queryRunner.query(`CREATE TABLE "chat_users_user" ("chatChatId" uuid NOT NULL, "userUserId" uuid NOT NULL, CONSTRAINT "PK_401100c9cd998c08be3b82dca0d" PRIMARY KEY ("chatChatId", "userUserId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_44ad9c4143e31cf9716267abe3" ON "chat_users_user" ("chatChatId") `);
        await queryRunner.query(`CREATE INDEX "IDX_870787392924836f661539264a" ON "chat_users_user" ("userUserId") `);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_cf7fa51763be4e2c8a4b6c51261" FOREIGN KEY ("chatChatId") REFERENCES "chat"("chat_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_0dc4e829a9c6d5d9004a0946ad9" FOREIGN KEY ("userUserId") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contact" ADD CONSTRAINT "FK_b7c1b2cddce3cf412fc8bf6562d" FOREIGN KEY ("userUserId") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contact" ADD CONSTRAINT "FK_f68e311bddf5bd3f86f995fa8ad" FOREIGN KEY ("contactUserUserId") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_03879f1bfdb3efdf24e732d8c73" FOREIGN KEY ("userUserId") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_metadata" ADD CONSTRAINT "FK_20236bcc5432d8e00b29d02bcfe" FOREIGN KEY ("userUserId") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_users_user" ADD CONSTRAINT "FK_44ad9c4143e31cf9716267abe36" FOREIGN KEY ("chatChatId") REFERENCES "chat"("chat_id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "chat_users_user" ADD CONSTRAINT "FK_870787392924836f661539264a7" FOREIGN KEY ("userUserId") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat_users_user" DROP CONSTRAINT "FK_870787392924836f661539264a7"`);
        await queryRunner.query(`ALTER TABLE "chat_users_user" DROP CONSTRAINT "FK_44ad9c4143e31cf9716267abe36"`);
        await queryRunner.query(`ALTER TABLE "user_metadata" DROP CONSTRAINT "FK_20236bcc5432d8e00b29d02bcfe"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_03879f1bfdb3efdf24e732d8c73"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP CONSTRAINT "FK_f68e311bddf5bd3f86f995fa8ad"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP CONSTRAINT "FK_b7c1b2cddce3cf412fc8bf6562d"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_0dc4e829a9c6d5d9004a0946ad9"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_cf7fa51763be4e2c8a4b6c51261"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_870787392924836f661539264a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_44ad9c4143e31cf9716267abe3"`);
        await queryRunner.query(`DROP TABLE "chat_users_user"`);
        await queryRunner.query(`DROP TABLE "user_metadata"`);
        await queryRunner.query(`DROP TABLE "notification"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1a2925ea113195a66e0e77cf38"`);
        await queryRunner.query(`DROP TABLE "contact"`);
        await queryRunner.query(`DROP TABLE "messages"`);
        await queryRunner.query(`DROP TABLE "chat"`);
        await queryRunner.query(`DROP TYPE "public"."chat_chat_type_enum"`);
    }

}
