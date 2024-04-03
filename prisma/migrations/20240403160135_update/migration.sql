/*
  Warnings:

  - The `pregnancyStatus` column on the `patient_health_datas` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "patient_health_datas" ALTER COLUMN "hasAllergies" DROP NOT NULL,
ALTER COLUMN "hasAllergies" SET DEFAULT false,
ALTER COLUMN "hasDiabetes" DROP NOT NULL,
ALTER COLUMN "hasDiabetes" SET DEFAULT false,
ALTER COLUMN "smokingStatus" DROP NOT NULL,
ALTER COLUMN "smokingStatus" SET DEFAULT false,
ALTER COLUMN "dietaryPreferences" DROP NOT NULL,
DROP COLUMN "pregnancyStatus",
ADD COLUMN     "pregnancyStatus" BOOLEAN DEFAULT false,
ALTER COLUMN "mentalHealthHistory" DROP NOT NULL,
ALTER COLUMN "immunizationStatus" DROP NOT NULL,
ALTER COLUMN "hasPastSurgeries" DROP NOT NULL,
ALTER COLUMN "hasPastSurgeries" SET DEFAULT false,
ALTER COLUMN "recentAnxiety" DROP NOT NULL,
ALTER COLUMN "recentAnxiety" SET DEFAULT false,
ALTER COLUMN "recentDepression" DROP NOT NULL,
ALTER COLUMN "recentDepression" SET DEFAULT false,
ALTER COLUMN "maritalStatus" SET DEFAULT 'UNMERRIED';
