/*
  Warnings:

  - You are about to drop the column `description` on the `Property` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Property` DROP COLUMN `description`,
    ADD COLUMN `createdById` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Property` ADD CONSTRAINT `Property_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `Customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
