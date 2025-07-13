-- CreateTable
CREATE TABLE "patients" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "birth_date" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "height" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "ethnicity" TEXT,
    "birth_weight" DOUBLE PRECISION,
    "gestational_age" INTEGER,
    "cord_fall_day" INTEGER,
    "parental_consanguinity" BOOLEAN NOT NULL DEFAULT false,
    "rule_based_score" INTEGER,
    "ml_score" DOUBLE PRECISION,
    "final_risk_level" TEXT,
    "has_immune_deficiency" BOOLEAN,
    "diagnosis_type" TEXT,
    "diagnosis_date" TEXT,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clinical_features" (
    "id" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "date_recorded" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "growth_failure" BOOLEAN NOT NULL DEFAULT false,
    "height_percentile" DOUBLE PRECISION,
    "weight_percentile" DOUBLE PRECISION,
    "chronic_skin_issue" BOOLEAN NOT NULL DEFAULT false,
    "skin_issue_type" TEXT,
    "skin_issue_duration" INTEGER,
    "chronic_diarrhea" BOOLEAN NOT NULL DEFAULT false,
    "diarrhea_duration" INTEGER,
    "bcg_lymphadenopathy" BOOLEAN NOT NULL DEFAULT false,
    "persistent_thrush" BOOLEAN NOT NULL DEFAULT false,
    "deep_abscesses" BOOLEAN NOT NULL DEFAULT false,
    "abscess_location" TEXT,
    "chd" BOOLEAN NOT NULL DEFAULT false,
    "chd_type" TEXT,

    CONSTRAINT "clinical_features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "family_history" (
    "id" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "family_iei_history" BOOLEAN NOT NULL DEFAULT false,
    "iei_relationship" TEXT,
    "iei_type" TEXT,
    "family_early_death" BOOLEAN NOT NULL DEFAULT false,
    "early_death_age" INTEGER,
    "early_death_cause" TEXT,
    "early_death_relationship" TEXT,
    "other_conditions" TEXT,

    CONSTRAINT "family_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hospitalizations" (
    "id" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "admission_date" TIMESTAMP(3) NOT NULL,
    "discharge_date" TIMESTAMP(3),
    "reason" TEXT NOT NULL,
    "diagnosis" TEXT,
    "icu_admission" BOOLEAN NOT NULL DEFAULT false,
    "icu_days" INTEGER,
    "iv_antibiotic_requirement" BOOLEAN NOT NULL DEFAULT false,
    "antibiotics_used" TEXT,
    "notes" TEXT,

    CONSTRAINT "hospitalizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "infections" (
    "id" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3),
    "type" TEXT NOT NULL,
    "severity" TEXT,
    "treatment" TEXT,
    "antibiotic_used" TEXT,
    "antibiotic_failure" BOOLEAN NOT NULL DEFAULT false,
    "hospitalization_required" BOOLEAN NOT NULL DEFAULT false,
    "hospitalization_id" INTEGER,

    CONSTRAINT "infections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lab_results" (
    "id" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "test_name" TEXT NOT NULL,
    "test_value" DOUBLE PRECISION,
    "test_unit" TEXT,
    "reference_min" DOUBLE PRECISION,
    "reference_max" DOUBLE PRECISION,
    "is_abnormal" BOOLEAN,
    "lab_name" TEXT,
    "notes" TEXT,

    CONSTRAINT "lab_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "treatments" (
    "id" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "ongoing" BOOLEAN NOT NULL DEFAULT false,
    "treatment_type" TEXT NOT NULL,
    "medication" TEXT,
    "dose" TEXT,
    "frequency" TEXT,
    "response" TEXT,
    "side_effects" TEXT,
    "notes" TEXT,

    CONSTRAINT "treatments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vaccinations" (
    "id" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "vaccine_name" TEXT NOT NULL,
    "dose_number" INTEGER,
    "reaction" TEXT,
    "antibody_tested" BOOLEAN NOT NULL DEFAULT false,
    "antibody_result" DOUBLE PRECISION,

    CONSTRAINT "vaccinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "risk_assessments" (
    "id" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "assessment_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assessed_by" TEXT,
    "primary_score" INTEGER,
    "secondary_score" INTEGER,
    "total_score" INTEGER,
    "risk_level" TEXT,
    "recommendation" TEXT,
    "model_version" TEXT,
    "model_confidence" DOUBLE PRECISION,

    CONSTRAINT "risk_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "clinical_features_patient_id_idx" ON "clinical_features"("patient_id");

-- CreateIndex
CREATE INDEX "family_history_patient_id_idx" ON "family_history"("patient_id");

-- CreateIndex
CREATE INDEX "hospitalizations_patient_id_idx" ON "hospitalizations"("patient_id");

-- CreateIndex
CREATE INDEX "infections_patient_id_idx" ON "infections"("patient_id");

-- CreateIndex
CREATE INDEX "lab_results_patient_id_idx" ON "lab_results"("patient_id");

-- CreateIndex
CREATE INDEX "treatments_patient_id_idx" ON "treatments"("patient_id");

-- CreateIndex
CREATE INDEX "vaccinations_patient_id_idx" ON "vaccinations"("patient_id");

-- CreateIndex
CREATE INDEX "risk_assessments_patient_id_idx" ON "risk_assessments"("patient_id");

-- AddForeignKey
ALTER TABLE "clinical_features" ADD CONSTRAINT "clinical_features_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "family_history" ADD CONSTRAINT "family_history_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hospitalizations" ADD CONSTRAINT "hospitalizations_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "infections" ADD CONSTRAINT "infections_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "infections" ADD CONSTRAINT "infections_hospitalization_id_fkey" FOREIGN KEY ("hospitalization_id") REFERENCES "hospitalizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lab_results" ADD CONSTRAINT "lab_results_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "treatments" ADD CONSTRAINT "treatments_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vaccinations" ADD CONSTRAINT "vaccinations_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "risk_assessments" ADD CONSTRAINT "risk_assessments_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
