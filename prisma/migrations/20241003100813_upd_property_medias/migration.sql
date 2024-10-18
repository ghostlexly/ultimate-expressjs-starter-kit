/*
  Warnings:

  - You are about to drop the `PropertyPhoto` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `PropertyPhoto` DROP FOREIGN KEY `PropertyPhoto_mediaId_fkey`;

-- DropForeignKey
ALTER TABLE `PropertyPhoto` DROP FOREIGN KEY `PropertyPhoto_propertyId_fkey`;

-- DropTable
DROP TABLE `PropertyPhoto`;

-- CreateTable
CREATE TABLE `_PropertyPhotos` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_PropertyPhotos_AB_unique`(`A`, `B`),
    INDEX `_PropertyPhotos_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PropertyDocuments` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_PropertyDocuments_AB_unique`(`A`, `B`),
    INDEX `_PropertyDocuments_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_PropertyPhotos` ADD CONSTRAINT `_PropertyPhotos_A_fkey` FOREIGN KEY (`A`) REFERENCES `Media`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PropertyPhotos` ADD CONSTRAINT `_PropertyPhotos_B_fkey` FOREIGN KEY (`B`) REFERENCES `Property`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PropertyDocuments` ADD CONSTRAINT `_PropertyDocuments_A_fkey` FOREIGN KEY (`A`) REFERENCES `Media`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PropertyDocuments` ADD CONSTRAINT `_PropertyDocuments_B_fkey` FOREIGN KEY (`B`) REFERENCES `Property`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
