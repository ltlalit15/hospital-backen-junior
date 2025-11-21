/*
  Warnings:

  - The values [A_POS,A_NEG,B_POS,B_NEG,AB_POS,AB_NEG,O_POS,O_NEG,UNKNOWN] on the enum `BloodInventory_bloodType` will be removed. If these variants are still used in the database, this will fail.
  - The values [A_POS,A_NEG,B_POS,B_NEG,AB_POS,AB_NEG,O_POS,O_NEG,UNKNOWN] on the enum `BloodInventory_bloodType` will be removed. If these variants are still used in the database, this will fail.
  - The values [A_POS,A_NEG,B_POS,B_NEG,AB_POS,AB_NEG,O_POS,O_NEG,UNKNOWN] on the enum `BloodInventory_bloodType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `blooddonor` MODIFY `bloodType` ENUM('A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE') NOT NULL;

-- AlterTable
ALTER TABLE `bloodinventory` MODIFY `bloodType` ENUM('A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE') NOT NULL;

-- AlterTable
ALTER TABLE `patient` MODIFY `bloodGroup` ENUM('A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE') NOT NULL;

-- CreateTable
CREATE TABLE `LabOrder` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `patientName` VARCHAR(191) NOT NULL,
    `testType` VARCHAR(191) NOT NULL,
    `orderedBy` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
