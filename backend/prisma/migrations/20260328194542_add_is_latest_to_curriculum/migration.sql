-- AlterTable
ALTER TABLE "Curriculum" ADD COLUMN     "is_latest" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Curriculum_is_latest_idx" ON "Curriculum"("is_latest");

-- CreateIndex
CREATE INDEX "Curriculum_title_version_idx" ON "Curriculum"("title", "version");

-- AddForeignKey
ALTER TABLE "Curriculum" ADD CONSTRAINT "Curriculum_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
