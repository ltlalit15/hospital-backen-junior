-- DropForeignKey
ALTER TABLE `PharmacySale` DROP FOREIGN KEY `PharmacySale_ProcessedBy_fkey`;

-- DropForeignKey
ALTER TABLE `PharmacySale` DROP FOREIGN KEY `PharmacySale_pharmacistId_fkey`;

-- AddForeignKey
ALTER TABLE `PharmacySale` ADD CONSTRAINT `PharmacySale_User_ProcessedBy_fkey` FOREIGN KEY (`pharmacistId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PharmacySale` ADD CONSTRAINT `PharmacySale_Pharmacist_fkey` FOREIGN KEY (`pharmacistId`) REFERENCES `Pharmacist`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
