import { MigrationInterface, QueryRunner } from "typeorm";

export class  CustomerType1752294069592 implements MigrationInterface {
    name = ' CustomerRange1752294069592'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "skygeni_schema"."customer_type" ("customer_type_id" SERIAL NOT NULL, "count" integer NOT NULL, "acv" numeric(15,2) NOT NULL, "closed_fiscal_quarter" character varying(7) NOT NULL, "type" character varying(20) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_956f3eadf38dcb3f3019441c558" PRIMARY KEY ("customer_type_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "skygeni_schema"."customer_type"`);
    }

}
