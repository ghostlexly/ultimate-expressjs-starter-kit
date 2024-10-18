/*
  Warnings:

  - Added the required column `customPropertyDescriptionId` to the `SmsNotification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `listingId` to the `SmsNotification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `SmsNotification` ADD COLUMN `customPropertyDescriptionId` VARCHAR(191) NOT NULL,
    ADD COLUMN `listingId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `PropertyCustomDescription` (
    `id` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `propertyId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PropertyCustomDescription` ADD CONSTRAINT `PropertyCustomDescription_propertyId_fkey` FOREIGN KEY (`propertyId`) REFERENCES `Property`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SmsNotification` ADD CONSTRAINT `SmsNotification_customPropertyDescriptionId_fkey` FOREIGN KEY (`customPropertyDescriptionId`) REFERENCES `PropertyCustomDescription`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SmsNotification` ADD CONSTRAINT `SmsNotification_listingId_fkey` FOREIGN KEY (`listingId`) REFERENCES `Listing`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
