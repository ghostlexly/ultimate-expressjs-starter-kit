/*
  Warnings:

  - Added the required column `customerId` to the `SmsNotification` table without a default value. This is not possible if the table is not empty.

*/

-- Clear the table SmsNotification
DELETE FROM SmsNotification;

-- AlterTable
ALTER TABLE `SmsNotification` ADD COLUMN `customerId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `SmsNotification` ADD CONSTRAINT `SmsNotification_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
