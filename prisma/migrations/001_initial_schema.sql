-- Initial database schema migration
-- HighPipe - Kubernetes 기반 데이터 파이프라인 자동화

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pg_trgm for full-text search
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Users table for authentication
CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "last_login_at" TIMESTAMP(3),
    "failed_login_attempts" INTEGER NOT NULL DEFAULT 0,
    "locked_until" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- User profiles table
CREATE TABLE IF NOT EXISTS "user_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "phone" TEXT,
    "avatar_url" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Seoul',
    "language" TEXT NOT NULL DEFAULT 'ko',
    "notification_preferences" JSONB NOT NULL DEFAULT '{"email": true, "push": true, "priceAlert": true}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- User sessions table
CREATE TABLE IF NOT EXISTS "user_sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "refresh_token_hash" TEXT NOT NULL,
    "device_info" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_used_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- Categories table
CREATE TABLE IF NOT EXISTS "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parent_id" TEXT,
    "path" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- Products table
CREATE TABLE IF NOT EXISTS "products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "category_id" TEXT,
    "current_price" DECIMAL(10,2),
    "average_rating" DOUBLE PRECISION,
    "total_reviews" INTEGER NOT NULL DEFAULT 0,
    "image_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_crawled_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- Price history table
CREATE TABLE IF NOT EXISTS "price_history" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "price_history_pkey" PRIMARY KEY ("id")
);

-- Analysis requests table
CREATE TABLE IF NOT EXISTS "analysis_requests" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "product_id" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "request_type" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 5,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "analysis_requests_pkey" PRIMARY KEY ("id")
);

-- Analysis results table
CREATE TABLE IF NOT EXISTS "analysis_results" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'processing',
    "sentiment_positive" DOUBLE PRECISION,
    "sentiment_negative" DOUBLE PRECISION,
    "sentiment_neutral" DOUBLE PRECISION,
    "summary" TEXT,
    "keywords" JSONB,
    "total_reviews" INTEGER NOT NULL DEFAULT 0,
    "average_rating" DOUBLE PRECISION,
    "rating_distribution" JSONB,
    "error_message" TEXT,
    "processing_time" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "analysis_results_pkey" PRIMARY KEY ("id")
);

-- Keywords table
CREATE TABLE IF NOT EXISTS "keywords" (
    "id" TEXT NOT NULL,
    "analysis_result_id" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "sentiment" TEXT NOT NULL,
    "frequency" INTEGER NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "keywords_pkey" PRIMARY KEY ("id")
);

-- Search history table
CREATE TABLE IF NOT EXISTS "search_history" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "result_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "search_history_pkey" PRIMARY KEY ("id")
);

-- Watch list table
CREATE TABLE IF NOT EXISTS "watch_list" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "price_alert" BOOLEAN NOT NULL DEFAULT true,
    "target_price" DECIMAL(10,2),
    "last_notified_at" TIMESTAMP(3),
    "analysis_frequency" TEXT NOT NULL DEFAULT 'daily',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "watch_list_pkey" PRIMARY KEY ("id")
);

-- System config table
CREATE TABLE IF NOT EXISTS "system_config" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_config_pkey" PRIMARY KEY ("id")
);

-- Create unique constraints
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "user_profiles_user_id_key" ON "user_profiles"("user_id");
CREATE UNIQUE INDEX IF NOT EXISTS "products_url_key" ON "products"("url");
CREATE UNIQUE INDEX IF NOT EXISTS "analysis_requests_task_id_key" ON "analysis_requests"("task_id");
CREATE UNIQUE INDEX IF NOT EXISTS "analysis_results_task_id_key" ON "analysis_results"("task_id");
CREATE UNIQUE INDEX IF NOT EXISTS "watch_list_user_id_product_id_key" ON "watch_list"("user_id", "product_id");
CREATE UNIQUE INDEX IF NOT EXISTS "system_config_key_key" ON "system_config"("key");

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS "users_role_idx" ON "users"("role");
CREATE INDEX IF NOT EXISTS "users_is_active_idx" ON "users"("is_active");
CREATE INDEX IF NOT EXISTS "user_sessions_user_id_idx" ON "user_sessions"("user_id");
CREATE INDEX IF NOT EXISTS "user_sessions_refresh_token_hash_idx" ON "user_sessions"("refresh_token_hash");
CREATE INDEX IF NOT EXISTS "user_sessions_expires_at_idx" ON "user_sessions"("expires_at");
CREATE INDEX IF NOT EXISTS "categories_parent_id_idx" ON "categories"("parent_id");
CREATE INDEX IF NOT EXISTS "categories_level_idx" ON "categories"("level");
CREATE INDEX IF NOT EXISTS "products_url_idx" ON "products"("url");
CREATE INDEX IF NOT EXISTS "products_category_id_idx" ON "products"("category_id");
CREATE INDEX IF NOT EXISTS "products_is_active_idx" ON "products"("is_active");
CREATE INDEX IF NOT EXISTS "products_last_crawled_at_idx" ON "products"("last_crawled_at");
CREATE INDEX IF NOT EXISTS "price_history_product_id_created_at_idx" ON "price_history"("product_id", "created_at");
CREATE INDEX IF NOT EXISTS "analysis_requests_user_id_idx" ON "analysis_requests"("user_id");
CREATE INDEX IF NOT EXISTS "analysis_requests_product_id_idx" ON "analysis_requests"("product_id");
CREATE INDEX IF NOT EXISTS "analysis_requests_task_id_idx" ON "analysis_requests"("task_id");
CREATE INDEX IF NOT EXISTS "analysis_requests_status_idx" ON "analysis_requests"("status");
CREATE INDEX IF NOT EXISTS "analysis_requests_created_at_idx" ON "analysis_requests"("created_at");
CREATE INDEX IF NOT EXISTS "analysis_results_product_id_idx" ON "analysis_results"("product_id");
CREATE INDEX IF NOT EXISTS "analysis_results_task_id_idx" ON "analysis_results"("task_id");
CREATE INDEX IF NOT EXISTS "analysis_results_status_idx" ON "analysis_results"("status");
CREATE INDEX IF NOT EXISTS "analysis_results_created_at_idx" ON "analysis_results"("created_at");
CREATE INDEX IF NOT EXISTS "keywords_analysis_result_id_idx" ON "keywords"("analysis_result_id");
CREATE INDEX IF NOT EXISTS "keywords_keyword_idx" ON "keywords"("keyword");
CREATE INDEX IF NOT EXISTS "keywords_sentiment_idx" ON "keywords"("sentiment");
CREATE INDEX IF NOT EXISTS "search_history_user_id_created_at_idx" ON "search_history"("user_id", "created_at");
CREATE INDEX IF NOT EXISTS "search_history_query_idx" ON "search_history"("query");
CREATE INDEX IF NOT EXISTS "watch_list_user_id_idx" ON "watch_list"("user_id");
CREATE INDEX IF NOT EXISTS "watch_list_product_id_idx" ON "watch_list"("product_id");
CREATE INDEX IF NOT EXISTS "watch_list_is_active_idx" ON "watch_list"("is_active");

-- Add foreign key constraints
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "price_history" ADD CONSTRAINT "price_history_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "analysis_requests" ADD CONSTRAINT "analysis_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "analysis_requests" ADD CONSTRAINT "analysis_requests_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "analysis_results" ADD CONSTRAINT "analysis_results_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "keywords" ADD CONSTRAINT "keywords_analysis_result_id_fkey" FOREIGN KEY ("analysis_result_id") REFERENCES "analysis_results"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "search_history" ADD CONSTRAINT "search_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "watch_list" ADD CONSTRAINT "watch_list_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "watch_list" ADD CONSTRAINT "watch_list_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;