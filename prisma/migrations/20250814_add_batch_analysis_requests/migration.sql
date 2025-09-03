-- CreateEnum
CREATE TYPE "BatchAnalysisStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "batch_analysis_requests" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" "BatchAnalysisStatus" NOT NULL DEFAULT 'PENDING',
    "scheduled_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "batch_analysis_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "batch_analysis_requests_product_id_idx" ON "batch_analysis_requests"("product_id");

-- CreateIndex
CREATE INDEX "batch_analysis_requests_user_id_idx" ON "batch_analysis_requests"("user_id");

-- CreateIndex
CREATE INDEX "batch_analysis_requests_status_idx" ON "batch_analysis_requests"("status");

-- CreateIndex
CREATE INDEX "batch_analysis_requests_scheduled_at_idx" ON "batch_analysis_requests"("scheduled_at");

-- CreateIndex
CREATE INDEX "batch_analysis_requests_created_at_idx" ON "batch_analysis_requests"("created_at");

-- AddForeignKey
ALTER TABLE "batch_analysis_requests" ADD CONSTRAINT "batch_analysis_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch_analysis_requests" ADD CONSTRAINT "batch_analysis_requests_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;