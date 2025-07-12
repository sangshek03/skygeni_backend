import { MigrationInterface, QueryRunner } from "typeorm";

export class  RCVRANGE1752292106300 implements MigrationInterface {
    name = ' RCVRANGE1752292106300'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "skygeni_schema"."acv_range" ("acv_range_id" SERIAL NOT NULL, "count" integer NOT NULL, "acv" numeric(15,2) NOT NULL, "closed_fiscal_quarter" character varying(7) NOT NULL, "range" character varying(20) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f311d45fd3f766694cd71cecd33" PRIMARY KEY ("acv_range_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "skygeni_schema"."acv_range"`);
    }

}
