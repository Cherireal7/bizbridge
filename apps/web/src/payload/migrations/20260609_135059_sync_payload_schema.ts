import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "payload"."enum_admins_role" AS ENUM('super_admin', 'editor', 'reviewer');
  CREATE TYPE "payload"."enum_sector_steps_tier_required" AS ENUM('free', 'premium');
  CREATE TYPE "payload"."enum_sector_documents_file_type" AS ENUM('pdf', 'docx', 'xlsx');
  CREATE TYPE "payload"."enum_sector_documents_tier_required" AS ENUM('free', 'premium');
  CREATE TYPE "payload"."enum_reports_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__reports_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_experts_languages_code" AS ENUM('am', 'en', 'or', 'ti', 'so');
  CREATE TYPE "payload"."enum_market_research_category" AS ENUM('demographics', 'tourism', 'economy', 'infrastructure', 'opportunities', 'other');
  CREATE TYPE "payload"."enum_market_research_tier_required" AS ENUM('free', 'premium');
  CREATE TYPE "payload"."enum_market_research_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__market_research_v_version_category" AS ENUM('demographics', 'tourism', 'economy', 'infrastructure', 'opportunities', 'other');
  CREATE TYPE "payload"."enum__market_research_v_version_tier_required" AS ENUM('free', 'premium');
  CREATE TYPE "payload"."enum__market_research_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_blog_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__blog_posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "payload"."admins_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "payload"."admins" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "payload"."enum_admins_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."business_sectors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"mor_code" varchar NOT NULL,
  	"name_en" varchar NOT NULL,
  	"name_am" varchar,
  	"slug" varchar NOT NULL,
  	"category_id" integer NOT NULL,
  	"description_short" varchar NOT NULL,
  	"description_full" jsonb,
  	"is_featured" boolean DEFAULT false,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."_business_sectors_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_mor_code" varchar NOT NULL,
  	"version_name_en" varchar NOT NULL,
  	"version_name_am" varchar,
  	"version_slug" varchar NOT NULL,
  	"version_category_id" integer NOT NULL,
  	"version_description_short" varchar NOT NULL,
  	"version_description_full" jsonb,
  	"version_is_featured" boolean DEFAULT false,
  	"version_is_active" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."sector_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name_en" varchar NOT NULL,
  	"name_am" varchar,
  	"slug" varchar NOT NULL,
  	"icon" varchar,
  	"sort_order" numeric DEFAULT 0 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."sector_license_requirements" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"sector_id" integer NOT NULL,
  	"license_type" varchar NOT NULL,
  	"issuing_authority" varchar NOT NULL,
  	"is_required" boolean DEFAULT true,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."sector_competency_certificates" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"sector_id" integer NOT NULL,
  	"certificate_name" varchar NOT NULL,
  	"issuing_body" varchar NOT NULL,
  	"is_mandatory" boolean DEFAULT true,
  	"description" varchar,
  	"processing_days_min" numeric,
  	"processing_days_max" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."sector_approvals" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"sector_id" integer NOT NULL,
  	"approval_name" varchar NOT NULL,
  	"approving_ministry" varchar NOT NULL,
  	"sequence_order" numeric DEFAULT 0 NOT NULL,
  	"processing_days_min" numeric,
  	"processing_days_max" numeric,
  	"is_required" boolean DEFAULT true,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."sector_costs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"sector_id" integer NOT NULL,
  	"cost_item" varchar NOT NULL,
  	"amount_birr_min" numeric,
  	"amount_birr_max" numeric,
  	"amount_usd_min" numeric,
  	"amount_usd_max" numeric,
  	"is_official_fee" boolean DEFAULT false,
  	"notes" varchar,
  	"last_verified_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."sector_steps_documents_needed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"document" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."sector_steps" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"sector_id" integer NOT NULL,
  	"step_number" numeric NOT NULL,
  	"title" varchar NOT NULL,
  	"description" jsonb,
  	"where_to_go" varchar,
  	"estimated_days" numeric,
  	"cost_reference_id" integer,
  	"tier_required" "payload"."enum_sector_steps_tier_required" DEFAULT 'premium' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."sector_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"sector_id" integer NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"file_type" "payload"."enum_sector_documents_file_type" DEFAULT 'pdf' NOT NULL,
  	"tier_required" "payload"."enum_sector_documents_tier_required" DEFAULT 'premium' NOT NULL,
  	"download_count" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "payload"."reports" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"description" varchar,
  	"sector_id" integer,
  	"price_usd" numeric,
  	"price_birr" numeric,
  	"preview_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "payload"."enum_reports_status" DEFAULT 'draft',
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "payload"."_reports_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_description" varchar,
  	"version_sector_id" integer,
  	"version_price_usd" numeric,
  	"version_price_birr" numeric,
  	"version_preview_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "payload"."enum__reports_v_version_status" DEFAULT 'draft',
  	"version_url" varchar,
  	"version_thumbnail_u_r_l" varchar,
  	"version_filename" varchar,
  	"version_mime_type" varchar,
  	"version_filesize" numeric,
  	"version_width" numeric,
  	"version_height" numeric,
  	"version_focal_x" numeric,
  	"version_focal_y" numeric,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."experts_specializations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"sector_id" integer,
  	"free_text" varchar
  );
  
  CREATE TABLE "payload"."experts_languages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"code" "payload"."enum_experts_languages_code" NOT NULL
  );
  
  CREATE TABLE "payload"."experts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"full_name" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"bio" jsonb,
  	"location" varchar DEFAULT 'Bishoftu',
  	"is_platform_team" boolean DEFAULT false,
  	"is_verified" boolean DEFAULT false,
  	"rating_avg" numeric,
  	"review_count" numeric DEFAULT 0,
  	"session_price_usd" numeric NOT NULL,
  	"session_price_birr" numeric NOT NULL,
  	"cal_username" varchar,
  	"profile_image_id" integer,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."market_research" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"city" varchar DEFAULT 'Bishoftu',
  	"category" "payload"."enum_market_research_category",
  	"content" jsonb,
  	"structured_data" jsonb,
  	"source" varchar,
  	"collected_at" timestamp(3) with time zone,
  	"tier_required" "payload"."enum_market_research_tier_required" DEFAULT 'free',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "payload"."enum_market_research_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "payload"."_market_research_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_city" varchar DEFAULT 'Bishoftu',
  	"version_category" "payload"."enum__market_research_v_version_category",
  	"version_content" jsonb,
  	"version_structured_data" jsonb,
  	"version_source" varchar,
  	"version_collected_at" timestamp(3) with time zone,
  	"version_tier_required" "payload"."enum__market_research_v_version_tier_required" DEFAULT 'free',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "payload"."enum__market_research_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"seo_description" varchar,
  	"content" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "payload"."enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "payload"."_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_seo_description" varchar,
  	"version_content" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "payload"."enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."blog_posts_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar
  );
  
  CREATE TABLE "payload"."blog_posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"content" jsonb,
  	"cover_image_id" integer,
  	"sector_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "payload"."enum_blog_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "payload"."_blog_posts_v_version_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_blog_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_content" jsonb,
  	"version_cover_image_id" integer,
  	"version_sector_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "payload"."enum__blog_posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "payload"."payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload"."payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer,
  	"business_sectors_id" integer,
  	"sector_categories_id" integer,
  	"sector_license_requirements_id" integer,
  	"sector_competency_certificates_id" integer,
  	"sector_approvals_id" integer,
  	"sector_costs_id" integer,
  	"sector_steps_id" integer,
  	"sector_documents_id" integer,
  	"reports_id" integer,
  	"experts_id" integer,
  	"market_research_id" integer,
  	"pages_id" integer,
  	"blog_posts_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "payload"."payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "payload"."payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT 'BizBridge Ethiopia' NOT NULL,
  	"tagline" varchar,
  	"logo_id" integer,
  	"social_links_twitter" varchar,
  	"social_links_linkedin" varchar,
  	"social_links_telegram" varchar,
  	"social_links_whatsapp" varchar,
  	"support_email" varchar DEFAULT 'support@bizbridge.et',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."pricing_config" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"one_time_standard_usd" numeric DEFAULT 29 NOT NULL,
  	"one_time_standard_etb" numeric DEFAULT 1600 NOT NULL,
  	"one_time_standard_label" varchar DEFAULT 'Standard',
  	"one_time_pro_usd" numeric DEFAULT 149 NOT NULL,
  	"one_time_pro_etb" numeric DEFAULT 8400 NOT NULL,
  	"one_time_pro_label" varchar DEFAULT 'Pro',
  	"reports_default_min_usd" numeric DEFAULT 15,
  	"reports_default_max_usd" numeric DEFAULT 99,
  	"fx_rate_birr_per_usd" numeric DEFAULT 56,
  	"payment_methods_chapa_enabled" boolean DEFAULT true,
  	"payment_methods_telebirr_enabled" boolean DEFAULT true,
  	"payment_methods_bank_transfer_enabled" boolean DEFAULT true,
  	"payment_methods_bank_details_bank_name" varchar,
  	"payment_methods_bank_details_account_name" varchar,
  	"payment_methods_bank_details_account_number" varchar,
  	"payment_methods_bank_details_swift" varchar,
  	"payment_methods_bank_details_instructions" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."homepage_content_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."homepage_content_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar NOT NULL,
  	"author" varchar NOT NULL,
  	"role" varchar
  );
  
  CREATE TABLE "payload"."homepage_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar,
  	"hero_headline" varchar NOT NULL,
  	"hero_subhead" varchar,
  	"hero_primary_cta_label" varchar DEFAULT 'Explore sectors',
  	"hero_primary_cta_href" varchar DEFAULT '/sectors',
  	"hero_secondary_cta_label" varchar DEFAULT 'See pricing',
  	"hero_secondary_cta_href" varchar DEFAULT '/pricing',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload"."admins_sessions" ADD CONSTRAINT "admins_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."business_sectors" ADD CONSTRAINT "business_sectors_category_id_sector_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "payload"."sector_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_business_sectors_v" ADD CONSTRAINT "_business_sectors_v_parent_id_business_sectors_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."business_sectors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_business_sectors_v" ADD CONSTRAINT "_business_sectors_v_version_category_id_sector_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "payload"."sector_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."sector_license_requirements" ADD CONSTRAINT "sector_license_requirements_sector_id_business_sectors_id_fk" FOREIGN KEY ("sector_id") REFERENCES "payload"."business_sectors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."sector_competency_certificates" ADD CONSTRAINT "sector_competency_certificates_sector_id_business_sectors_id_fk" FOREIGN KEY ("sector_id") REFERENCES "payload"."business_sectors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."sector_approvals" ADD CONSTRAINT "sector_approvals_sector_id_business_sectors_id_fk" FOREIGN KEY ("sector_id") REFERENCES "payload"."business_sectors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."sector_costs" ADD CONSTRAINT "sector_costs_sector_id_business_sectors_id_fk" FOREIGN KEY ("sector_id") REFERENCES "payload"."business_sectors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."sector_steps_documents_needed" ADD CONSTRAINT "sector_steps_documents_needed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."sector_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."sector_steps" ADD CONSTRAINT "sector_steps_sector_id_business_sectors_id_fk" FOREIGN KEY ("sector_id") REFERENCES "payload"."business_sectors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."sector_steps" ADD CONSTRAINT "sector_steps_cost_reference_id_sector_costs_id_fk" FOREIGN KEY ("cost_reference_id") REFERENCES "payload"."sector_costs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."sector_documents" ADD CONSTRAINT "sector_documents_sector_id_business_sectors_id_fk" FOREIGN KEY ("sector_id") REFERENCES "payload"."business_sectors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."reports" ADD CONSTRAINT "reports_sector_id_business_sectors_id_fk" FOREIGN KEY ("sector_id") REFERENCES "payload"."business_sectors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."reports" ADD CONSTRAINT "reports_preview_id_media_id_fk" FOREIGN KEY ("preview_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_reports_v" ADD CONSTRAINT "_reports_v_parent_id_reports_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."reports"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_reports_v" ADD CONSTRAINT "_reports_v_version_sector_id_business_sectors_id_fk" FOREIGN KEY ("version_sector_id") REFERENCES "payload"."business_sectors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_reports_v" ADD CONSTRAINT "_reports_v_version_preview_id_media_id_fk" FOREIGN KEY ("version_preview_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."experts_specializations" ADD CONSTRAINT "experts_specializations_sector_id_business_sectors_id_fk" FOREIGN KEY ("sector_id") REFERENCES "payload"."business_sectors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."experts_specializations" ADD CONSTRAINT "experts_specializations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."experts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."experts_languages" ADD CONSTRAINT "experts_languages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."experts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."experts" ADD CONSTRAINT "experts_profile_image_id_media_id_fk" FOREIGN KEY ("profile_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_market_research_v" ADD CONSTRAINT "_market_research_v_parent_id_market_research_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."market_research"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."blog_posts_tags" ADD CONSTRAINT "blog_posts_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."blog_posts" ADD CONSTRAINT "blog_posts_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."blog_posts" ADD CONSTRAINT "blog_posts_sector_id_business_sectors_id_fk" FOREIGN KEY ("sector_id") REFERENCES "payload"."business_sectors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_blog_posts_v_version_tags" ADD CONSTRAINT "_blog_posts_v_version_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_blog_posts_v" ADD CONSTRAINT "_blog_posts_v_parent_id_blog_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."blog_posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_blog_posts_v" ADD CONSTRAINT "_blog_posts_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_blog_posts_v" ADD CONSTRAINT "_blog_posts_v_version_sector_id_business_sectors_id_fk" FOREIGN KEY ("version_sector_id") REFERENCES "payload"."business_sectors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "payload"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_business_sectors_fk" FOREIGN KEY ("business_sectors_id") REFERENCES "payload"."business_sectors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sector_categories_fk" FOREIGN KEY ("sector_categories_id") REFERENCES "payload"."sector_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sector_license_requirements_fk" FOREIGN KEY ("sector_license_requirements_id") REFERENCES "payload"."sector_license_requirements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sector_competency_certifica_fk" FOREIGN KEY ("sector_competency_certificates_id") REFERENCES "payload"."sector_competency_certificates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sector_approvals_fk" FOREIGN KEY ("sector_approvals_id") REFERENCES "payload"."sector_approvals"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sector_costs_fk" FOREIGN KEY ("sector_costs_id") REFERENCES "payload"."sector_costs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sector_steps_fk" FOREIGN KEY ("sector_steps_id") REFERENCES "payload"."sector_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sector_documents_fk" FOREIGN KEY ("sector_documents_id") REFERENCES "payload"."sector_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reports_fk" FOREIGN KEY ("reports_id") REFERENCES "payload"."reports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_experts_fk" FOREIGN KEY ("experts_id") REFERENCES "payload"."experts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_market_research_fk" FOREIGN KEY ("market_research_id") REFERENCES "payload"."market_research"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_posts_fk" FOREIGN KEY ("blog_posts_id") REFERENCES "payload"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "payload"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "payload"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."homepage_content_stats" ADD CONSTRAINT "homepage_content_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."homepage_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."homepage_content_testimonials" ADD CONSTRAINT "homepage_content_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."homepage_content"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "admins_sessions_order_idx" ON "payload"."admins_sessions" USING btree ("_order");
  CREATE INDEX "admins_sessions_parent_id_idx" ON "payload"."admins_sessions" USING btree ("_parent_id");
  CREATE INDEX "admins_updated_at_idx" ON "payload"."admins" USING btree ("updated_at");
  CREATE INDEX "admins_created_at_idx" ON "payload"."admins" USING btree ("created_at");
  CREATE UNIQUE INDEX "admins_email_idx" ON "payload"."admins" USING btree ("email");
  CREATE UNIQUE INDEX "business_sectors_mor_code_idx" ON "payload"."business_sectors" USING btree ("mor_code");
  CREATE INDEX "business_sectors_name_en_idx" ON "payload"."business_sectors" USING btree ("name_en");
  CREATE UNIQUE INDEX "business_sectors_slug_idx" ON "payload"."business_sectors" USING btree ("slug");
  CREATE INDEX "business_sectors_category_idx" ON "payload"."business_sectors" USING btree ("category_id");
  CREATE INDEX "business_sectors_updated_at_idx" ON "payload"."business_sectors" USING btree ("updated_at");
  CREATE INDEX "business_sectors_created_at_idx" ON "payload"."business_sectors" USING btree ("created_at");
  CREATE INDEX "_business_sectors_v_parent_idx" ON "payload"."_business_sectors_v" USING btree ("parent_id");
  CREATE INDEX "_business_sectors_v_version_version_mor_code_idx" ON "payload"."_business_sectors_v" USING btree ("version_mor_code");
  CREATE INDEX "_business_sectors_v_version_version_name_en_idx" ON "payload"."_business_sectors_v" USING btree ("version_name_en");
  CREATE INDEX "_business_sectors_v_version_version_slug_idx" ON "payload"."_business_sectors_v" USING btree ("version_slug");
  CREATE INDEX "_business_sectors_v_version_version_category_idx" ON "payload"."_business_sectors_v" USING btree ("version_category_id");
  CREATE INDEX "_business_sectors_v_version_version_updated_at_idx" ON "payload"."_business_sectors_v" USING btree ("version_updated_at");
  CREATE INDEX "_business_sectors_v_version_version_created_at_idx" ON "payload"."_business_sectors_v" USING btree ("version_created_at");
  CREATE INDEX "_business_sectors_v_created_at_idx" ON "payload"."_business_sectors_v" USING btree ("created_at");
  CREATE INDEX "_business_sectors_v_updated_at_idx" ON "payload"."_business_sectors_v" USING btree ("updated_at");
  CREATE UNIQUE INDEX "sector_categories_slug_idx" ON "payload"."sector_categories" USING btree ("slug");
  CREATE INDEX "sector_categories_updated_at_idx" ON "payload"."sector_categories" USING btree ("updated_at");
  CREATE INDEX "sector_categories_created_at_idx" ON "payload"."sector_categories" USING btree ("created_at");
  CREATE INDEX "sector_license_requirements_sector_idx" ON "payload"."sector_license_requirements" USING btree ("sector_id");
  CREATE INDEX "sector_license_requirements_updated_at_idx" ON "payload"."sector_license_requirements" USING btree ("updated_at");
  CREATE INDEX "sector_license_requirements_created_at_idx" ON "payload"."sector_license_requirements" USING btree ("created_at");
  CREATE INDEX "sector_competency_certificates_sector_idx" ON "payload"."sector_competency_certificates" USING btree ("sector_id");
  CREATE INDEX "sector_competency_certificates_updated_at_idx" ON "payload"."sector_competency_certificates" USING btree ("updated_at");
  CREATE INDEX "sector_competency_certificates_created_at_idx" ON "payload"."sector_competency_certificates" USING btree ("created_at");
  CREATE INDEX "sector_approvals_sector_idx" ON "payload"."sector_approvals" USING btree ("sector_id");
  CREATE INDEX "sector_approvals_updated_at_idx" ON "payload"."sector_approvals" USING btree ("updated_at");
  CREATE INDEX "sector_approvals_created_at_idx" ON "payload"."sector_approvals" USING btree ("created_at");
  CREATE INDEX "sector_costs_sector_idx" ON "payload"."sector_costs" USING btree ("sector_id");
  CREATE INDEX "sector_costs_updated_at_idx" ON "payload"."sector_costs" USING btree ("updated_at");
  CREATE INDEX "sector_costs_created_at_idx" ON "payload"."sector_costs" USING btree ("created_at");
  CREATE INDEX "sector_steps_documents_needed_order_idx" ON "payload"."sector_steps_documents_needed" USING btree ("_order");
  CREATE INDEX "sector_steps_documents_needed_parent_id_idx" ON "payload"."sector_steps_documents_needed" USING btree ("_parent_id");
  CREATE INDEX "sector_steps_sector_idx" ON "payload"."sector_steps" USING btree ("sector_id");
  CREATE INDEX "sector_steps_cost_reference_idx" ON "payload"."sector_steps" USING btree ("cost_reference_id");
  CREATE INDEX "sector_steps_updated_at_idx" ON "payload"."sector_steps" USING btree ("updated_at");
  CREATE INDEX "sector_steps_created_at_idx" ON "payload"."sector_steps" USING btree ("created_at");
  CREATE INDEX "sector_documents_sector_idx" ON "payload"."sector_documents" USING btree ("sector_id");
  CREATE INDEX "sector_documents_updated_at_idx" ON "payload"."sector_documents" USING btree ("updated_at");
  CREATE INDEX "sector_documents_created_at_idx" ON "payload"."sector_documents" USING btree ("created_at");
  CREATE UNIQUE INDEX "sector_documents_filename_idx" ON "payload"."sector_documents" USING btree ("filename");
  CREATE INDEX "reports_title_idx" ON "payload"."reports" USING btree ("title");
  CREATE UNIQUE INDEX "reports_slug_idx" ON "payload"."reports" USING btree ("slug");
  CREATE INDEX "reports_sector_idx" ON "payload"."reports" USING btree ("sector_id");
  CREATE INDEX "reports_preview_idx" ON "payload"."reports" USING btree ("preview_id");
  CREATE INDEX "reports_updated_at_idx" ON "payload"."reports" USING btree ("updated_at");
  CREATE INDEX "reports_created_at_idx" ON "payload"."reports" USING btree ("created_at");
  CREATE INDEX "reports__status_idx" ON "payload"."reports" USING btree ("_status");
  CREATE UNIQUE INDEX "reports_filename_idx" ON "payload"."reports" USING btree ("filename");
  CREATE INDEX "_reports_v_parent_idx" ON "payload"."_reports_v" USING btree ("parent_id");
  CREATE INDEX "_reports_v_version_version_title_idx" ON "payload"."_reports_v" USING btree ("version_title");
  CREATE INDEX "_reports_v_version_version_slug_idx" ON "payload"."_reports_v" USING btree ("version_slug");
  CREATE INDEX "_reports_v_version_version_sector_idx" ON "payload"."_reports_v" USING btree ("version_sector_id");
  CREATE INDEX "_reports_v_version_version_preview_idx" ON "payload"."_reports_v" USING btree ("version_preview_id");
  CREATE INDEX "_reports_v_version_version_updated_at_idx" ON "payload"."_reports_v" USING btree ("version_updated_at");
  CREATE INDEX "_reports_v_version_version_created_at_idx" ON "payload"."_reports_v" USING btree ("version_created_at");
  CREATE INDEX "_reports_v_version_version__status_idx" ON "payload"."_reports_v" USING btree ("version__status");
  CREATE INDEX "_reports_v_version_version_filename_idx" ON "payload"."_reports_v" USING btree ("version_filename");
  CREATE INDEX "_reports_v_created_at_idx" ON "payload"."_reports_v" USING btree ("created_at");
  CREATE INDEX "_reports_v_updated_at_idx" ON "payload"."_reports_v" USING btree ("updated_at");
  CREATE INDEX "_reports_v_latest_idx" ON "payload"."_reports_v" USING btree ("latest");
  CREATE INDEX "experts_specializations_order_idx" ON "payload"."experts_specializations" USING btree ("_order");
  CREATE INDEX "experts_specializations_parent_id_idx" ON "payload"."experts_specializations" USING btree ("_parent_id");
  CREATE INDEX "experts_specializations_sector_idx" ON "payload"."experts_specializations" USING btree ("sector_id");
  CREATE INDEX "experts_languages_order_idx" ON "payload"."experts_languages" USING btree ("_order");
  CREATE INDEX "experts_languages_parent_id_idx" ON "payload"."experts_languages" USING btree ("_parent_id");
  CREATE INDEX "experts_profile_image_idx" ON "payload"."experts" USING btree ("profile_image_id");
  CREATE INDEX "experts_updated_at_idx" ON "payload"."experts" USING btree ("updated_at");
  CREATE INDEX "experts_created_at_idx" ON "payload"."experts" USING btree ("created_at");
  CREATE INDEX "market_research_title_idx" ON "payload"."market_research" USING btree ("title");
  CREATE INDEX "market_research_city_idx" ON "payload"."market_research" USING btree ("city");
  CREATE INDEX "market_research_updated_at_idx" ON "payload"."market_research" USING btree ("updated_at");
  CREATE INDEX "market_research_created_at_idx" ON "payload"."market_research" USING btree ("created_at");
  CREATE INDEX "market_research__status_idx" ON "payload"."market_research" USING btree ("_status");
  CREATE INDEX "_market_research_v_parent_idx" ON "payload"."_market_research_v" USING btree ("parent_id");
  CREATE INDEX "_market_research_v_version_version_title_idx" ON "payload"."_market_research_v" USING btree ("version_title");
  CREATE INDEX "_market_research_v_version_version_city_idx" ON "payload"."_market_research_v" USING btree ("version_city");
  CREATE INDEX "_market_research_v_version_version_updated_at_idx" ON "payload"."_market_research_v" USING btree ("version_updated_at");
  CREATE INDEX "_market_research_v_version_version_created_at_idx" ON "payload"."_market_research_v" USING btree ("version_created_at");
  CREATE INDEX "_market_research_v_version_version__status_idx" ON "payload"."_market_research_v" USING btree ("version__status");
  CREATE INDEX "_market_research_v_created_at_idx" ON "payload"."_market_research_v" USING btree ("created_at");
  CREATE INDEX "_market_research_v_updated_at_idx" ON "payload"."_market_research_v" USING btree ("updated_at");
  CREATE INDEX "_market_research_v_latest_idx" ON "payload"."_market_research_v" USING btree ("latest");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "payload"."pages" USING btree ("slug");
  CREATE INDEX "pages_updated_at_idx" ON "payload"."pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "payload"."pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "payload"."pages" USING btree ("_status");
  CREATE INDEX "_pages_v_parent_idx" ON "payload"."_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "payload"."_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "payload"."_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "payload"."_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "payload"."_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "payload"."_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "payload"."_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "payload"."_pages_v" USING btree ("latest");
  CREATE INDEX "blog_posts_tags_order_idx" ON "payload"."blog_posts_tags" USING btree ("_order");
  CREATE INDEX "blog_posts_tags_parent_id_idx" ON "payload"."blog_posts_tags" USING btree ("_parent_id");
  CREATE INDEX "blog_posts_title_idx" ON "payload"."blog_posts" USING btree ("title");
  CREATE UNIQUE INDEX "blog_posts_slug_idx" ON "payload"."blog_posts" USING btree ("slug");
  CREATE INDEX "blog_posts_cover_image_idx" ON "payload"."blog_posts" USING btree ("cover_image_id");
  CREATE INDEX "blog_posts_sector_idx" ON "payload"."blog_posts" USING btree ("sector_id");
  CREATE INDEX "blog_posts_updated_at_idx" ON "payload"."blog_posts" USING btree ("updated_at");
  CREATE INDEX "blog_posts_created_at_idx" ON "payload"."blog_posts" USING btree ("created_at");
  CREATE INDEX "blog_posts__status_idx" ON "payload"."blog_posts" USING btree ("_status");
  CREATE INDEX "_blog_posts_v_version_tags_order_idx" ON "payload"."_blog_posts_v_version_tags" USING btree ("_order");
  CREATE INDEX "_blog_posts_v_version_tags_parent_id_idx" ON "payload"."_blog_posts_v_version_tags" USING btree ("_parent_id");
  CREATE INDEX "_blog_posts_v_parent_idx" ON "payload"."_blog_posts_v" USING btree ("parent_id");
  CREATE INDEX "_blog_posts_v_version_version_title_idx" ON "payload"."_blog_posts_v" USING btree ("version_title");
  CREATE INDEX "_blog_posts_v_version_version_slug_idx" ON "payload"."_blog_posts_v" USING btree ("version_slug");
  CREATE INDEX "_blog_posts_v_version_version_cover_image_idx" ON "payload"."_blog_posts_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_blog_posts_v_version_version_sector_idx" ON "payload"."_blog_posts_v" USING btree ("version_sector_id");
  CREATE INDEX "_blog_posts_v_version_version_updated_at_idx" ON "payload"."_blog_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_blog_posts_v_version_version_created_at_idx" ON "payload"."_blog_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_blog_posts_v_version_version__status_idx" ON "payload"."_blog_posts_v" USING btree ("version__status");
  CREATE INDEX "_blog_posts_v_created_at_idx" ON "payload"."_blog_posts_v" USING btree ("created_at");
  CREATE INDEX "_blog_posts_v_updated_at_idx" ON "payload"."_blog_posts_v" USING btree ("updated_at");
  CREATE INDEX "_blog_posts_v_latest_idx" ON "payload"."_blog_posts_v" USING btree ("latest");
  CREATE INDEX "media_updated_at_idx" ON "payload"."media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "payload"."media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "payload"."media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "payload"."media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "payload"."media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "payload"."media" USING btree ("sizes_hero_filename");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload"."payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload"."payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload"."payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload"."payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload"."payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload"."payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload"."payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_admins_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("admins_id");
  CREATE INDEX "payload_locked_documents_rels_business_sectors_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("business_sectors_id");
  CREATE INDEX "payload_locked_documents_rels_sector_categories_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("sector_categories_id");
  CREATE INDEX "payload_locked_documents_rels_sector_license_requirement_idx" ON "payload"."payload_locked_documents_rels" USING btree ("sector_license_requirements_id");
  CREATE INDEX "payload_locked_documents_rels_sector_competency_certific_idx" ON "payload"."payload_locked_documents_rels" USING btree ("sector_competency_certificates_id");
  CREATE INDEX "payload_locked_documents_rels_sector_approvals_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("sector_approvals_id");
  CREATE INDEX "payload_locked_documents_rels_sector_costs_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("sector_costs_id");
  CREATE INDEX "payload_locked_documents_rels_sector_steps_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("sector_steps_id");
  CREATE INDEX "payload_locked_documents_rels_sector_documents_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("sector_documents_id");
  CREATE INDEX "payload_locked_documents_rels_reports_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("reports_id");
  CREATE INDEX "payload_locked_documents_rels_experts_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("experts_id");
  CREATE INDEX "payload_locked_documents_rels_market_research_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("market_research_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_blog_posts_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("blog_posts_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload"."payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload"."payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload"."payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload"."payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload"."payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload"."payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_admins_id_idx" ON "payload"."payload_preferences_rels" USING btree ("admins_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload"."payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload"."payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_logo_idx" ON "payload"."site_settings" USING btree ("logo_id");
  CREATE INDEX "homepage_content_stats_order_idx" ON "payload"."homepage_content_stats" USING btree ("_order");
  CREATE INDEX "homepage_content_stats_parent_id_idx" ON "payload"."homepage_content_stats" USING btree ("_parent_id");
  CREATE INDEX "homepage_content_testimonials_order_idx" ON "payload"."homepage_content_testimonials" USING btree ("_order");
  CREATE INDEX "homepage_content_testimonials_parent_id_idx" ON "payload"."homepage_content_testimonials" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "payload"."admins_sessions" CASCADE;
  DROP TABLE "payload"."admins" CASCADE;
  DROP TABLE "payload"."business_sectors" CASCADE;
  DROP TABLE "payload"."_business_sectors_v" CASCADE;
  DROP TABLE "payload"."sector_categories" CASCADE;
  DROP TABLE "payload"."sector_license_requirements" CASCADE;
  DROP TABLE "payload"."sector_competency_certificates" CASCADE;
  DROP TABLE "payload"."sector_approvals" CASCADE;
  DROP TABLE "payload"."sector_costs" CASCADE;
  DROP TABLE "payload"."sector_steps_documents_needed" CASCADE;
  DROP TABLE "payload"."sector_steps" CASCADE;
  DROP TABLE "payload"."sector_documents" CASCADE;
  DROP TABLE "payload"."reports" CASCADE;
  DROP TABLE "payload"."_reports_v" CASCADE;
  DROP TABLE "payload"."experts_specializations" CASCADE;
  DROP TABLE "payload"."experts_languages" CASCADE;
  DROP TABLE "payload"."experts" CASCADE;
  DROP TABLE "payload"."market_research" CASCADE;
  DROP TABLE "payload"."_market_research_v" CASCADE;
  DROP TABLE "payload"."pages" CASCADE;
  DROP TABLE "payload"."_pages_v" CASCADE;
  DROP TABLE "payload"."blog_posts_tags" CASCADE;
  DROP TABLE "payload"."blog_posts" CASCADE;
  DROP TABLE "payload"."_blog_posts_v_version_tags" CASCADE;
  DROP TABLE "payload"."_blog_posts_v" CASCADE;
  DROP TABLE "payload"."media" CASCADE;
  DROP TABLE "payload"."payload_kv" CASCADE;
  DROP TABLE "payload"."payload_locked_documents" CASCADE;
  DROP TABLE "payload"."payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload"."payload_preferences" CASCADE;
  DROP TABLE "payload"."payload_preferences_rels" CASCADE;
  DROP TABLE "payload"."payload_migrations" CASCADE;
  DROP TABLE "payload"."site_settings" CASCADE;
  DROP TABLE "payload"."pricing_config" CASCADE;
  DROP TABLE "payload"."homepage_content_stats" CASCADE;
  DROP TABLE "payload"."homepage_content_testimonials" CASCADE;
  DROP TABLE "payload"."homepage_content" CASCADE;
  DROP TYPE "payload"."enum_admins_role";
  DROP TYPE "payload"."enum_sector_steps_tier_required";
  DROP TYPE "payload"."enum_sector_documents_file_type";
  DROP TYPE "payload"."enum_sector_documents_tier_required";
  DROP TYPE "payload"."enum_reports_status";
  DROP TYPE "payload"."enum__reports_v_version_status";
  DROP TYPE "payload"."enum_experts_languages_code";
  DROP TYPE "payload"."enum_market_research_category";
  DROP TYPE "payload"."enum_market_research_tier_required";
  DROP TYPE "payload"."enum_market_research_status";
  DROP TYPE "payload"."enum__market_research_v_version_category";
  DROP TYPE "payload"."enum__market_research_v_version_tier_required";
  DROP TYPE "payload"."enum__market_research_v_version_status";
  DROP TYPE "payload"."enum_pages_status";
  DROP TYPE "payload"."enum__pages_v_version_status";
  DROP TYPE "payload"."enum_blog_posts_status";
  DROP TYPE "payload"."enum__blog_posts_v_version_status";`)
}
