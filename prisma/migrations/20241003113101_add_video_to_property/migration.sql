-- AlterTable
ALTER TABLE `Property` ADD COLUMN `videoId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Property` ADD CONSTRAINT `Property_videoId_fkey` FOREIGN KEY (`videoId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
