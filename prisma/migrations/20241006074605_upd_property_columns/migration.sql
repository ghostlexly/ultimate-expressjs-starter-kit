/*
  Warnings:

  - Made the column `name` on table `Property` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Property` MODIFY `name` VARCHAR(191) NOT NULL,
    MODIFY `rooms` INTEGER NULL,
    MODIFY `bedrooms` INTEGER NULL,
    MODIFY `bathrooms` INTEGER NULL,
    MODIFY `squareMeters` INTEGER NULL,
    MODIFY `parkingSpots` INTEGER NULL,
    MODIFY `price` DOUBLE NULL;
