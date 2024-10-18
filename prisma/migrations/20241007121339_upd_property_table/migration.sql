/*
  Warnings:

  - You are about to drop the column `bathrooms` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `bedrooms` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `floor` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `floorsInTheBuilding` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `parkingSpots` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `possibleRentalPrice` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `yearOfConstruction` on the `Property` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Property` DROP COLUMN `bathrooms`,
    DROP COLUMN `bedrooms`,
    DROP COLUMN `floor`,
    DROP COLUMN `floorsInTheBuilding`,
    DROP COLUMN `parkingSpots`,
    DROP COLUMN `possibleRentalPrice`,
    DROP COLUMN `yearOfConstruction`,
    ADD COLUMN `coOwnershipCharges` DOUBLE NULL,
    ADD COLUMN `freeToRent` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `landTax` DOUBLE NULL;
