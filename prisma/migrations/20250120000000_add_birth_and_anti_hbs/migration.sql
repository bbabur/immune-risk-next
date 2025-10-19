-- CreateTable
CREATE TABLE "anti_hbs_references" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "age_group_name" TEXT NOT NULL,
    "min_age_months" INTEGER NOT NULL,
    "max_age_months" INTEGER,
    "expected_min_value" DOUBLE PRECISION,
    "expected_max_value" DOUBLE PRECISION,
    "typical_range" TEXT NOT NULL,
    "seroprotection_threshold" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "seroprotection_rate" TEXT,
    "description" TEXT NOT NULL,
    "source_reference" TEXT,
    "is_booster_response" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "anti_hbs_references_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "patients" ADD COLUMN     "birth_type" TEXT,
ADD COLUMN     "breastfeeding_months" INTEGER;

-- CreateIndex
CREATE INDEX "anti_hbs_references_min_age_months_max_age_months_idx" ON "anti_hbs_references"("min_age_months", "max_age_months");

