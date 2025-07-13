-- CreateTable
CREATE TABLE "patients" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "birth_date" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "height" REAL,
    "weight" REAL,
    "ethnicity" TEXT,
    "birth_weight" REAL,
    "gestational_age" INTEGER,
    "cord_fall_day" INTEGER,
    "parental_consanguinity" BOOLEAN NOT NULL DEFAULT false,
    "rule_based_score" INTEGER,
    "ml_score" REAL,
    "final_risk_level" TEXT,
    "has_immune_deficiency" BOOLEAN,
    "diagnosis_type" TEXT,
    "diagnosis_date" TEXT
);

-- CreateTable
CREATE TABLE "clinical_features" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "patient_id" INTEGER NOT NULL,
    "date_recorded" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "growth_failure" BOOLEAN NOT NULL DEFAULT false,
    "height_percentile" REAL,
    "weight_percentile" REAL,
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
    CONSTRAINT "clinical_features_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "family_history" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "patient_id" INTEGER NOT NULL,
    "family_iei_history" BOOLEAN NOT NULL DEFAULT false,
    "iei_relationship" TEXT,
    "iei_type" TEXT,
    "family_early_death" BOOLEAN NOT NULL DEFAULT false,
    "early_death_age" INTEGER,
    "early_death_cause" TEXT,
    "early_death_relationship" TEXT,
    "other_conditions" TEXT,
    CONSTRAINT "family_history_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "hospitalizations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "patient_id" INTEGER NOT NULL,
    "admission_date" DATETIME NOT NULL,
    "discharge_date" DATETIME,
    "reason" TEXT NOT NULL,
    "diagnosis" TEXT,
    "icu_admission" BOOLEAN NOT NULL DEFAULT false,
    "icu_days" INTEGER,
    "iv_antibiotic_requirement" BOOLEAN NOT NULL DEFAULT false,
    "antibiotics_used" TEXT,
    "notes" TEXT,
    CONSTRAINT "hospitalizations_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "infections" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "patient_id" INTEGER NOT NULL,
    "date" DATETIME,
    "type" TEXT NOT NULL,
    "severity" TEXT,
    "treatment" TEXT,
    "antibiotic_used" TEXT,
    "antibiotic_failure" BOOLEAN NOT NULL DEFAULT false,
    "hospitalization_required" BOOLEAN NOT NULL DEFAULT false,
    "hospitalization_id" INTEGER,
    CONSTRAINT "infections_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "infections_hospitalization_id_fkey" FOREIGN KEY ("hospitalization_id") REFERENCES "hospitalizations" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "lab_results" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "patient_id" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "test_name" TEXT NOT NULL,
    "test_value" REAL,
    "test_unit" TEXT,
    "reference_min" REAL,
    "reference_max" REAL,
    "is_abnormal" BOOLEAN,
    "lab_name" TEXT,
    "notes" TEXT,
    CONSTRAINT "lab_results_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "treatments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "patient_id" INTEGER NOT NULL,
    "start_date" DATETIME NOT NULL,
    "end_date" DATETIME,
    "ongoing" BOOLEAN NOT NULL DEFAULT false,
    "treatment_type" TEXT NOT NULL,
    "medication" TEXT,
    "dose" TEXT,
    "frequency" TEXT,
    "response" TEXT,
    "side_effects" TEXT,
    "notes" TEXT,
    CONSTRAINT "treatments_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "vaccinations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "patient_id" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "vaccine_name" TEXT NOT NULL,
    "dose_number" INTEGER,
    "reaction" TEXT,
    "antibody_tested" BOOLEAN NOT NULL DEFAULT false,
    "antibody_result" REAL,
    CONSTRAINT "vaccinations_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "risk_assessments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "patient_id" INTEGER NOT NULL,
    "assessment_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assessed_by" TEXT,
    "primary_score" INTEGER,
    "secondary_score" INTEGER,
    "total_score" INTEGER,
    "risk_level" TEXT,
    "recommendation" TEXT,
    "model_version" TEXT,
    "model_confidence" REAL,
    CONSTRAINT "risk_assessments_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
