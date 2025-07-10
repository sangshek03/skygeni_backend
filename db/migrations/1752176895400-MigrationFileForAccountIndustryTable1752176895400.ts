import { MigrationInterface, QueryRunner } from "typeorm";

export class  MigrationFileForAccountIndustryTable1752176895400 implements MigrationInterface {
    name = ' MigrationFileForAccountIndustryTable1752176895400'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "skygeni_schema"."account_industry" ("account_industry_id" SERIAL NOT NULL, "count" integer NOT NULL, "acv" numeric(15,2) NOT NULL, "closed_fiscal_quarter" character varying(7) NOT NULL, "acct_industry" character varying(50) NOT NULL, "query_key" character varying(20) NOT NULL DEFAULT 'industry', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b8fedd36da00d75d17e8a59e9e1" PRIMARY KEY ("account_industry_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "skygeni_schema"."account_industry"`);
    }

}
