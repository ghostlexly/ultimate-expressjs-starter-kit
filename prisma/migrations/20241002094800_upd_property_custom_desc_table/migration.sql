/*
  Warnings:

  - You are about to drop the column `propertyId` on the `PropertyCustomDescription` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `PropertyCustomDescription` DROP FOREIGN KEY `PropertyCustomDescription_propertyId_fkey`;

-- AlterTable
ALTER TABLE `PropertyCustomDescription` DROP COLUMN `propertyId`;
