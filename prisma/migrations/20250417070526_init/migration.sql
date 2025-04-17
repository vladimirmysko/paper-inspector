-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "header" TEXT NOT NULL,
    "finalAssessment" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "depthOfUnderstanding" INTEGER NOT NULL,
    "argumentationAndLogic" INTEGER NOT NULL,
    "originalityAndCriticism" INTEGER NOT NULL,
    "styleAndLiteracy" INTEGER NOT NULL,
    "formalRequirements" INTEGER NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);
