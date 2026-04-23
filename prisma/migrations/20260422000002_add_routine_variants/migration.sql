-- Migration: add_routine_variants
-- Introduces RoutineVariant as a middle layer between Routine and RoutineItem.
-- Items now belong to a variant (not directly to a routine).
-- Logs now record which variant was used on a given day.

-- Step 1: Drop FK tying RoutineItem.routineId to Routine
ALTER TABLE "RoutineItem" DROP CONSTRAINT "RoutineItem_routineId_fkey";

-- Step 2: Drop FK tying RoutineLog.routineId to Routine (will re-add after adding variantId)
ALTER TABLE "RoutineLog" DROP CONSTRAINT "RoutineLog_routineId_fkey";

-- Step 3: Create RoutineVariant table
CREATE TABLE "RoutineVariant" (
    "id"        TEXT    NOT NULL,
    "routineId" TEXT    NOT NULL,
    "days"      JSONB   NOT NULL DEFAULT '[]',
    "label"     TEXT,
    "order"     INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "RoutineVariant_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "RoutineVariant_routineId_idx" ON "RoutineVariant"("routineId");

ALTER TABLE "RoutineVariant"
    ADD CONSTRAINT "RoutineVariant_routineId_fkey"
    FOREIGN KEY ("routineId") REFERENCES "Routine"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

-- Step 4: Update Routine — remove schedule blob, add timeSlot + customTime
ALTER TABLE "Routine" DROP COLUMN "schedule";
ALTER TABLE "Routine" ADD COLUMN "timeSlot"   TEXT;
ALTER TABLE "Routine" ADD COLUMN "customTime" TEXT;

-- Step 5: Update RoutineItem — swap routineId → variantId
ALTER TABLE "RoutineItem" ADD COLUMN "variantId" TEXT;
-- (Production: backfill variantId here via data migration before dropping routineId)
ALTER TABLE "RoutineItem" DROP COLUMN "routineId";
ALTER TABLE "RoutineItem" ALTER COLUMN "variantId" SET NOT NULL;

ALTER TABLE "RoutineItem"
    ADD CONSTRAINT "RoutineItem_variantId_fkey"
    FOREIGN KEY ("variantId") REFERENCES "RoutineVariant"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "RoutineItem_variantId_idx" ON "RoutineItem"("variantId");

-- Step 6: Update RoutineLog — add variantId
ALTER TABLE "RoutineLog" ADD COLUMN "variantId" TEXT;
-- (Production: backfill variantId before making NOT NULL)
ALTER TABLE "RoutineLog" ALTER COLUMN "variantId" SET NOT NULL;

ALTER TABLE "RoutineLog"
    ADD CONSTRAINT "RoutineLog_routineId_fkey"
    FOREIGN KEY ("routineId") REFERENCES "Routine"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "RoutineLog"
    ADD CONSTRAINT "RoutineLog_variantId_fkey"
    FOREIGN KEY ("variantId") REFERENCES "RoutineVariant"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
