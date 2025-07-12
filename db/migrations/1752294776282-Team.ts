import { MigrationInterface, QueryRunner } from "typeorm";

export class  Team1752294776282 implements MigrationInterface {
    name = ' Team1752294776282'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "skygeni_schema"."team" ("team_id" SERIAL NOT NULL, "count" integer NOT NULL, "acv" numeric(15,2) NOT NULL, "closed_fiscal_quarter" character varying(7) NOT NULL, "name" character varying(50) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a35a345d4436b82adf6bb76f3ce" PRIMARY KEY ("team_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "skygeni_schema"."team"`);
    }

}
