import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Fix: the versioned array tables created in 20260722_010000_ had id as varchar,
// but Payload populates them via drizzle with an auto-increment serial id. Drop
// and recreate with serial id. Tables are empty at this point (seed failed
// mid-run before this fix), so no data loss.

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "payload"."_business_sectors_v_version_legacy_codes" CASCADE;
    DROP TABLE IF EXISTS "payload"."_business_sectors_v_version_permitted_operations_am" CASCADE;
    DROP TABLE IF EXISTS "payload"."_business_sectors_v_version_permitted_operations_en" CASCADE;

    CREATE TABLE "payload"."_business_sectors_v_version_legacy_codes" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "code" varchar,
      "_uuid" varchar
    );

    CREATE TABLE "payload"."_business_sectors_v_version_permitted_operations_am" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "text" varchar,
      "_uuid" varchar
    );

    CREATE TABLE "payload"."_business_sectors_v_version_permitted_operations_en" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "text" varchar,
      "_uuid" varchar
    );

    ALTER TABLE "payload"."_business_sectors_v_version_legacy_codes"
      ADD CONSTRAINT "_business_sectors_v_version_legacy_codes_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "payload"."_business_sectors_v"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "payload"."_business_sectors_v_version_permitted_operations_am"
      ADD CONSTRAINT "_business_sectors_v_version_permitted_operations_am_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "payload"."_business_sectors_v"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "payload"."_business_sectors_v_version_permitted_operations_en"
      ADD CONSTRAINT "_business_sectors_v_version_permitted_operations_en_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "payload"."_business_sectors_v"("id")
      ON DELETE cascade ON UPDATE no action;

    CREATE INDEX "_business_sectors_v_version_legacy_codes_order_idx"
      ON "payload"."_business_sectors_v_version_legacy_codes" USING btree ("_order");
    CREATE INDEX "_business_sectors_v_version_legacy_codes_parent_id_idx"
      ON "payload"."_business_sectors_v_version_legacy_codes" USING btree ("_parent_id");

    CREATE INDEX "_business_sectors_v_version_permitted_operations_am_order_idx"
      ON "payload"."_business_sectors_v_version_permitted_operations_am" USING btree ("_order");
    CREATE INDEX "_business_sectors_v_version_permitted_operations_am_parent_id_idx"
      ON "payload"."_business_sectors_v_version_permitted_operations_am" USING btree ("_parent_id");

    CREATE INDEX "_business_sectors_v_version_permitted_operations_en_order_idx"
      ON "payload"."_business_sectors_v_version_permitted_operations_en" USING btree ("_order");
    CREATE INDEX "_business_sectors_v_version_permitted_operations_en_parent_id_idx"
      ON "payload"."_business_sectors_v_version_permitted_operations_en" USING btree ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "payload"."_business_sectors_v_version_legacy_codes" CASCADE;
    DROP TABLE IF EXISTS "payload"."_business_sectors_v_version_permitted_operations_am" CASCADE;
    DROP TABLE IF EXISTS "payload"."_business_sectors_v_version_permitted_operations_en" CASCADE;
  `)
}
