-- DropForeignKey
ALTER TABLE "educations" DROP CONSTRAINT "educations_resumeId_fkey";

-- AddForeignKey
ALTER TABLE "educations" ADD CONSTRAINT "educations_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "resumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
