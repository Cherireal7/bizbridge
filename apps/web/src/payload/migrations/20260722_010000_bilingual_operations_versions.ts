import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Companion to 20260722_000000_bilingual_operations: adds the versioned-copy
// tables Payload requires for every array field on a collection that has a
// _v (versions) shadow table.

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE "payload"."_business_sectors_v_version_legacy_codes" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "code" varchar,
      "_uuid" varchar
    );

    CREATE TABLE "payload"."_business_sectors_v_version_permitted_operations_am" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "text" varchar,
      "_uuid" varchar
    );

    CREATE TABLE "payload"."_business_sectors_v_version_permitted_operations_en" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
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
    DROP TABLE IF EXISTS "payload"."_business_sectors_v_version_legacy_codes";
    DROP TABLE IF EXISTS "payload"."_business_sectors_v_version_permitted_operations_am";
    DROP TABLE IF EXISTS "payload"."_business_sectors_v_version_permitted_operations_en";
  `)
}
