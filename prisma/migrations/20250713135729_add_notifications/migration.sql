/*
  Warnings:

  - You are about to drop the `clinical_features` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "clinical_features" DROP CONSTRAINT "clinical_features_patient_id_fkey";

-- DropIndex
DROP INDEX "family_history_patient_id_idx";

-- DropIndex
DROP INDEX "hospitalizations_patient_id_idx";

-- DropIndex
DROP INDEX "infections_patient_id_idx";

-- DropIndex
DROP INDEX "lab_results_patient_id_idx";

-- DropIndex
DROP INDEX "risk_assessments_patient_id_idx";

-- DropIndex
DROP INDEX "treatments_patient_id_idx";

-- DropIndex
DROP INDEX "vaccinations_patient_id_idx";

-- DropTable
DROP TABLE "clinical_features";

-- CreateTable
CREATE TABLE "ClinicalFeature" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "patientId" INTEGER NOT NULL,
    "growthFailure" BOOLEAN NOT NULL,
    "heightPercentile" DOUBLE PRECISION,
    "weightPercentile" DOUBLE PRECISION,
    "chronicSkinIssue" BOOLEAN NOT NULL,
    "skinIssueType" TEXT,
    "skinIssueDuration" INTEGER,
    "chronicDiarrhea" BOOLEAN NOT NULL,
    "diarrheaDuration" INTEGER,
    "bcgLymphadenopathy" BOOLEAN NOT NULL,
    "persistentThrush" BOOLEAN NOT NULL,
    "deepAbscesses" BOOLEAN NOT NULL,
    "abscessLocation" TEXT,
    "chd" BOOLEAN NOT NULL,
    "chdType" TEXT,

    CONSTRAINT "ClinicalFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'info',
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "patient_id" INTEGER,
    "category" TEXT NOT NULL DEFAULT 'system',
    "data" JSONB,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClinicalFeature_patientId_idx" ON "ClinicalFeature"("patientId");

-- AddForeignKey
ALTER TABLE "ClinicalFeature" ADD CONSTRAINT "ClinicalFeature_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
