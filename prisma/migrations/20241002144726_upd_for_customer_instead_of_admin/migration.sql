/*
  Warnings:

  - You are about to drop the column `stripeCustomerId` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionType` on the `Customer` table. All the data in the column will be lost.
  - Added the required column `customerId` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerId` to the `Subscriber` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Customer_stripeCustomerId_key` ON `Customer`;

-- AlterTable
ALTER TABLE `Customer` DROP COLUMN `stripeCustomerId`,
    DROP COLUMN `subscriptionType`;

-- AlterTable
ALTER TABLE `Listing` ADD COLUMN `customerId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Subscriber` ADD COLUMN `customerId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Listing` ADD CONSTRAINT `Listing_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subscriber` ADD CONSTRAINT `Subscriber_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
