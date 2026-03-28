/*
  Warnings:

  - You are about to drop the column `it_coordinator` on the `School` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Curriculum" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Pending Approval',
ALTER COLUMN "approved_by" DROP NOT NULL,
ALTER COLUMN "approved_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "School" DROP COLUMN "it_coordinator",
ADD COLUMN     "it_coordinator_id" TEXT;

-- AlterTable
ALTER TABLE "Ticket" ALTER COLUMN "created_at" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "School" ADD CONSTRAINT "School_it_coordinator_id_fkey" FOREIGN KEY ("it_coordinator_id") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
