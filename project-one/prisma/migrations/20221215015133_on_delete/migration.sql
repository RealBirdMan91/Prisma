-- DropForeignKey
ALTER TABLE "ExtendedProfile" DROP CONSTRAINT "ExtendedProfile_userId_fkey";

-- AddForeignKey
ALTER TABLE "ExtendedProfile" ADD CONSTRAINT "ExtendedProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
