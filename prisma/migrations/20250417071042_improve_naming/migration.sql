/*
  Warnings:

  - You are about to drop the `Report` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Report";

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "header" TEXT NOT NULL,
    "final_assessment" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "depth_of_understanding" INTEGER NOT NULL,
    "argumentation_and_logic" INTEGER NOT NULL,
    "originality_and_criticism" INTEGER NOT NULL,
    "style_and_literacy" INTEGER NOT NULL,
    "formal_requirements" INTEGER NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_reports_created_at" ON "reports"("created_at");
