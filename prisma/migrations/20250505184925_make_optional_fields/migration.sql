-- AlterTable
ALTER TABLE "reports" ALTER COLUMN "final_assessment" DROP NOT NULL,
ALTER COLUMN "comment" DROP NOT NULL,
ALTER COLUMN "depth_of_understanding" DROP NOT NULL,
ALTER COLUMN "argumentation_and_logic" DROP NOT NULL,
ALTER COLUMN "originality_and_criticism" DROP NOT NULL,
ALTER COLUMN "style_and_literacy" DROP NOT NULL,
ALTER COLUMN "formal_requirements" DROP NOT NULL;
