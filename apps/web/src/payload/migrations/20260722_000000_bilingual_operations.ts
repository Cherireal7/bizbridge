import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE "payload"."business_sectors_legacy_codes" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "code" varchar NOT NULL
    );

    CREATE TABLE "payload"."business_sectors_permitted_operations_am" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "text" varchar NOT NULL
    );

    CREATE TABLE "payload"."business_sectors_permitted_operations_en" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "text" varchar NOT NULL
    );

    ALTER TABLE "payload"."business_sectors_legacy_codes"
      ADD CONSTRAINT "business_sectors_legacy_codes_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "payload"."business_sectors"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "payload"."business_sectors_permitted_operations_am"
      ADD CONSTRAINT "business_sectors_permitted_operations_am_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "payload"."business_sectors"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "payload"."business_sectors_permitted_operations_en"
      ADD CONSTRAINT "business_sectors_permitted_operations_en_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "payload"."business_sectors"("id")
      ON DELETE cascade ON UPDATE no action;

    CREATE INDEX "business_sectors_legacy_codes_order_idx"
      ON "payload"."business_sectors_legacy_codes" USING btree ("_order");
    CREATE INDEX "business_sectors_legacy_codes_parent_id_idx"
      ON "payload"."business_sectors_legacy_codes" USING btree ("_parent_id");

    CREATE INDEX "business_sectors_permitted_operations_am_order_idx"
      ON "payload"."business_sectors_permitted_operations_am" USING btree ("_order");
    CREATE INDEX "business_sectors_permitted_operations_am_parent_id_idx"
      ON "payload"."business_sectors_permitted_operations_am" USING btree ("_parent_id");

    CREATE INDEX "business_sectors_permitted_operations_en_order_idx"
      ON "payload"."business_sectors_permitted_operations_en" USING btree ("_order");
    CREATE INDEX "business_sectors_permitted_operations_en_parent_id_idx"
      ON "payload"."business_sectors_permitted_operations_en" USING btree ("_parent_id");

    -- Drop tier_required from sector_steps, sector_documents, market_research
    ALTER TABLE "payload"."sector_steps" DROP COLUMN IF EXISTS "tier_required";
    ALTER TABLE "payload"."sector_documents" DROP COLUMN IF EXISTS "tier_required";
    ALTER TABLE "payload"."market_research" DROP COLUMN IF EXISTS "tier_required";
    ALTER TABLE "payload"."_market_research_v" DROP COLUMN IF EXISTS "version_tier_required";

    -- Drop the now-orphan enums (safe: cascade only affects those columns which are already gone)
    DROP TYPE IF EXISTS "payload"."enum_sector_steps_tier_required";
    DROP TYPE IF EXISTS "payload"."enum_sector_documents_tier_required";
    DROP TYPE IF EXISTS "payload"."enum_market_research_tier_required";
    DROP TYPE IF EXISTS "payload"."enum__market_research_v_version_tier_required";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "payload"."business_sectors_legacy_codes";
    DROP TABLE IF EXISTS "payload"."business_sectors_permitted_operations_am";
    DROP TABLE IF EXISTS "payload"."business_sectors_permitted_operations_en";

    -- Restore tier_required columns and enums
    CREATE TYPE "payload"."enum_sector_steps_tier_required" AS ENUM('free', 'premium');
    CREATE TYPE "payload"."enum_sector_documents_tier_required" AS ENUM('free', 'premium');
    CREATE TYPE "payload"."enum_market_research_tier_required" AS ENUM('free', 'premium');
    CREATE TYPE "payload"."enum__market_research_v_version_tier_required" AS ENUM('free', 'premium');

    ALTER TABLE "payload"."sector_steps"
      ADD COLUMN "tier_required" "payload"."enum_sector_steps_tier_required" DEFAULT 'premium' NOT NULL;
    ALTER TABLE "payload"."sector_documents"
      ADD COLUMN "tier_required" "payload"."enum_sector_documents_tier_required" DEFAULT 'premium' NOT NULL;
    ALTER TABLE "payload"."market_research"
      ADD COLUMN "tier_required" "payload"."enum_market_research_tier_required" DEFAULT 'free' NOT NULL;
    ALTER TABLE "payload"."_market_research_v"
      ADD COLUMN "version_tier_required" "payload"."enum__market_research_v_version_tier_required" DEFAULT 'free';
  `)
}
