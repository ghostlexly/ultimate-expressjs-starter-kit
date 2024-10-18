/*
  Warnings:

  - You are about to drop the column `customPropertyDescriptionId` on the `SmsNotification` table. All the data in the column will be lost.
  - You are about to drop the `PropertyCustomDescription` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `SmsNotification` DROP FOREIGN KEY `SmsNotification_customPropertyDescriptionId_fkey`;

-- AlterTable
ALTER TABLE `Property` ADD COLUMN `description` TEXT NULL;

-- AlterTable
ALTER TABLE `SmsNotification` DROP COLUMN `customPropertyDescriptionId`,
    MODIFY `content` TEXT NOT NULL;

-- DropTable
DROP TABLE `PropertyCustomDescription`;
