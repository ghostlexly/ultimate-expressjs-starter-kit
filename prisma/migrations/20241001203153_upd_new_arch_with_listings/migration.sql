/*
  Warnings:

  - You are about to drop the `PushNotification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PushNotificationSubscription` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `PushNotification`;

-- DropTable
DROP TABLE `PushNotificationSubscription`;

-- CreateTable
CREATE TABLE `SmsNotification` (
    `id` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `status` ENUM('PENDING', 'SENT', 'ERROR') NOT NULL DEFAULT 'PENDING',
    `propertyId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Listing` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Listing_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subscriber` (
    `id` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ListingSubscribers` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ListingSubscribers_AB_unique`(`A`, `B`),
    INDEX `_ListingSubscribers_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SmsNotification` ADD CONSTRAINT `SmsNotification_propertyId_fkey` FOREIGN KEY (`propertyId`) REFERENCES `Property`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ListingSubscribers` ADD CONSTRAINT `_ListingSubscribers_A_fkey` FOREIGN KEY (`A`) REFERENCES `Listing`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ListingSubscribers` ADD CONSTRAINT `_ListingSubscribers_B_fkey` FOREIGN KEY (`B`) REFERENCES `Subscriber`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
