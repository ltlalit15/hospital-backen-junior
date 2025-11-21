-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `publicId` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'DOCTOR', 'NURSE', 'PHARMACIST', 'LAB_TECH', 'RADIOLOGIST', 'FINANCE', 'HR', 'PATIENT', 'AUDITOR') NOT NULL,
    `firstName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NULL,
    `displayName` VARCHAR(191) NULL,
    `gender` ENUM('MALE', 'FEMALE', 'OTHER', 'UNKNOWN') NOT NULL DEFAULT 'UNKNOWN',
    `dateOfBirth` DATETIME(3) NULL,
    `phone` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdById` INTEGER NULL,
    `updatedById` INTEGER NULL,

    UNIQUE INDEX `User_publicId_key`(`publicId`),
    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_phone_key`(`phone`),
    INDEX `User_role_idx`(`role`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AuditLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entity` VARCHAR(191) NOT NULL,
    `entityId` INTEGER NULL,
    `action` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `performedBy` INTEGER NULL,
    `metadata` JSON NULL,
    `ipAddress` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AuditLog_entity_entityId_idx`(`entity`, `entityId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `publicId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `roles_publicId_key`(`publicId`),
    UNIQUE INDEX `roles_name_key`(`name`),
    INDEX `roles_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Department` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `publicId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `type` ENUM('CLINICAL', 'NON_CLINICAL', 'SUPPORT', 'ADMIN') NOT NULL DEFAULT 'CLINICAL',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Department_publicId_key`(`publicId`),
    UNIQUE INDEX `Department_code_key`(`code`),
    INDEX `Department_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Patient` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `publicId` VARCHAR(191) NOT NULL,
    `userId` INTEGER NULL,
    `mrn` VARCHAR(191) NULL,
    `fatherName` VARCHAR(191) NOT NULL,
    `nationalId` VARCHAR(191) NULL,
    `bloodGroup` ENUM('A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG', 'UNKNOWN') NOT NULL,
    `allergies` VARCHAR(191) NULL,
    `medicalHistory` VARCHAR(191) NULL,
    `currentTreatment` VARCHAR(191) NULL,
    `height` DOUBLE NULL,
    `weight` DOUBLE NULL,
    `emergencyName` VARCHAR(191) NULL,
    `emergencyPhone` VARCHAR(191) NULL,
    `insuranceInfo` JSON NULL,
    `insuranceProvider` VARCHAR(191) NULL,
    `policyNumber` VARCHAR(191) NULL,
    `status` ENUM('OPD', 'IPD', 'EMERGENCY', 'DISCHARGE', 'CANCELLED') NULL DEFAULT 'OPD',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Patient_publicId_key`(`publicId`),
    UNIQUE INDEX `Patient_userId_key`(`userId`),
    UNIQUE INDEX `Patient_mrn_key`(`mrn`),
    UNIQUE INDEX `Patient_nationalId_key`(`nationalId`),
    INDEX `Patient_publicId_idx`(`publicId`),
    INDEX `Patient_status_idx`(`status`),
    INDEX `Patient_nationalId_idx`(`nationalId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Doctor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `publicId` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `doctorCode` VARCHAR(191) NOT NULL,
    `referralCodeId` INTEGER NULL,
    `speciality` VARCHAR(191) NULL,
    `departmentId` INTEGER NULL,
    `qualifications` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Doctor_publicId_key`(`publicId`),
    UNIQUE INDEX `Doctor_userId_key`(`userId`),
    UNIQUE INDEX `Doctor_doctorCode_key`(`doctorCode`),
    INDEX `Doctor_doctorCode_idx`(`doctorCode`),
    INDEX `Doctor_publicId_idx`(`publicId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Nurse` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `publicId` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `ward` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Nurse_publicId_key`(`publicId`),
    UNIQUE INDEX `Nurse_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pharmacist` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `publicId` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Pharmacist_publicId_key`(`publicId`),
    UNIQUE INDEX `Pharmacist_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StaffAttendance` (
    `id` VARCHAR(191) NOT NULL,
    `staffId` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `shiftType` ENUM('DAY', 'NIGHT') NOT NULL,
    `status` ENUM('PRESENT', 'ABSENT', 'LATE', 'ON_LEAVE') NOT NULL DEFAULT 'PRESENT',
    `checkInTime` DATETIME(3) NULL,
    `checkOutTime` DATETIME(3) NULL,
    `remarks` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `StaffAttendance_staffId_date_idx`(`staffId`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Room` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `publicId` VARCHAR(191) NOT NULL,
    `departmentId` INTEGER NULL,
    `name` VARCHAR(191) NOT NULL,
    `floor` VARCHAR(191) NULL,
    `type` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Room_publicId_key`(`publicId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Bed` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roomId` INTEGER NOT NULL,
    `bedNumber` VARCHAR(191) NOT NULL,
    `isOccupied` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admission` (
    `id` VARCHAR(191) NOT NULL,
    `publicId` VARCHAR(191) NOT NULL,
    `patientId` INTEGER NOT NULL,
    `doctorId` INTEGER NULL,
    `bedId` INTEGER NULL,
    `admissionDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `admissionReason` VARCHAR(191) NULL,
    `status` ENUM('ADMITTED', 'DISCHARGED') NOT NULL DEFAULT 'ADMITTED',
    `dischargedAt` DATETIME(3) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Admission_publicId_key`(`publicId`),
    INDEX `Admission_publicId_idx`(`publicId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Appointment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `publicId` VARCHAR(191) NOT NULL,
    `appointmentNumber` VARCHAR(191) NULL,
    `patientId` INTEGER NOT NULL,
    `doctorId` INTEGER NULL,
    `departmentId` INTEGER NULL,
    `scheduledAt` DATETIME(3) NOT NULL,
    `durationMins` INTEGER NULL,
    `status` ENUM('SCHEDULED', 'CONFIRMED', 'CHECKED_IN', 'IN_CONSULTATION', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'RESCHEDULED') NOT NULL DEFAULT 'SCHEDULED',
    `reason` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,
    `referralCodeId` INTEGER NULL,
    `checkedInAt` DATETIME(3) NULL,
    `consultedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Appointment_publicId_key`(`publicId`),
    UNIQUE INDEX `Appointment_appointmentNumber_key`(`appointmentNumber`),
    INDEX `Appointment_patientId_scheduledAt_idx`(`patientId`, `scheduledAt`),
    INDEX `Appointment_doctorId_status_idx`(`doctorId`, `status`),
    INDEX `Appointment_publicId_idx`(`publicId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MedicalRecord` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `patientId` INTEGER NOT NULL,
    `title` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `attachments` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdById` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FollowUp` (
    `id` VARCHAR(191) NOT NULL,
    `patientId` INTEGER NOT NULL,
    `appointmentId` INTEGER NULL,
    `doctorId` INTEGER NULL,
    `followUpDate` DATETIME(3) NOT NULL,
    `purpose` ENUM('REVIEW', 'LAB_RESULT', 'PROCEDURE', 'FOLLOW_CHECKUP') NOT NULL,
    `notes` VARCHAR(191) NULL,
    `feedback` VARCHAR(191) NULL,
    `status` ENUM('SCHEDULED', 'COMPLETED', 'MISSED', 'CANCELLED') NOT NULL DEFAULT 'SCHEDULED',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `FollowUp_patientId_followUpDate_idx`(`patientId`, `followUpDate`),
    INDEX `FollowUp_doctorId_status_idx`(`doctorId`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReferralCode` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `publicId` VARCHAR(191) NOT NULL,
    `doctorId` INTEGER NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `isAuto` BOOLEAN NOT NULL DEFAULT true,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `deletedAt` DATETIME(3) NULL,
    `validFrom` DATETIME(3) NULL,
    `validTo` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ReferralCode_publicId_key`(`publicId`),
    UNIQUE INDEX `ReferralCode_code_key`(`code`),
    INDEX `ReferralCode_doctorId_idx`(`doctorId`),
    INDEX `ReferralCode_code_idx`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CommissionSetup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdById` INTEGER NULL,
    `doctorId` INTEGER NULL,
    `departmentId` INTEGER NULL,
    `referralCodeId` INTEGER NULL,
    `source` ENUM('PHARMACY', 'LAB', 'RADIOLOGY', 'PROCEDURE', 'BLOOD_BANK', 'CONSULTATION', 'OTHER') NOT NULL,
    `commissionType` ENUM('PERCENTAGE', 'FLAT') NOT NULL DEFAULT 'PERCENTAGE',
    `value` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    `description` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `validFrom` DATETIME(3) NULL,
    `validTo` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `CommissionSetup_source_doctorId_departmentId_idx`(`source`, `doctorId`, `departmentId`),
    INDEX `CommissionSetup_source_doctorId_departmentId_referralCodeId_idx`(`source`, `doctorId`, `departmentId`, `referralCodeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CommissionTransaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `referralCodeId` INTEGER NULL,
    `doctorId` INTEGER NOT NULL,
    `departmentId` INTEGER NULL,
    `sourceType` ENUM('PHARMACY', 'LAB', 'RADIOLOGY', 'PROCEDURE', 'BLOOD_BANK', 'CONSULTATION', 'OTHER') NOT NULL,
    `sourceId` INTEGER NULL,
    `invoiceId` INTEGER NULL,
    `amount` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    `percentage` DECIMAL(14, 2) NULL,
    `commissionType` ENUM('PERCENTAGE', 'FLAT') NOT NULL,
    `status` ENUM('PENDING', 'READY_TO_PAY', 'PAID', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `paidAt` DATETIME(3) NULL,

    INDEX `CommissionTransaction_doctorId_status_sourceType_departmentI_idx`(`doctorId`, `status`, `sourceType`, `departmentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CommissionPayout` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `payoutNumber` VARCHAR(191) NULL,
    `totalAmount` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    `issuedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdById` INTEGER NULL,
    `notes` VARCHAR(191) NULL,

    UNIQUE INDEX `CommissionPayout_payoutNumber_key`(`payoutNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CommissionPayoutItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `commissionPayoutId` INTEGER NOT NULL,
    `commissionTransactionId` INTEGER NOT NULL,
    `amount` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,

    UNIQUE INDEX `CommissionPayoutItem_commissionTransactionId_key`(`commissionTransactionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DoctorEarning` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `doctorId` INTEGER NOT NULL,
    `amount` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    `sourceType` ENUM('PHARMACY', 'LAB', 'RADIOLOGY', 'PROCEDURE', 'BLOOD_BANK', 'CONSULTATION', 'OTHER') NOT NULL,
    `sourceId` INTEGER NULL,
    `referralCode` VARCHAR(191) NULL,
    `note` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `DoctorEarning_doctorId_sourceType_createdAt_idx`(`doctorId`, `sourceType`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Medicine` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `publicId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `sku` VARCHAR(191) NULL,
    `brand` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `unitPrice` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Medicine_publicId_key`(`publicId`),
    UNIQUE INDEX `Medicine_sku_key`(`sku`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PharmacyStock` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `medicineId` INTEGER NOT NULL,
    `batchNumber` VARCHAR(191) NULL,
    `expiryDate` DATETIME(3) NULL,
    `quantity` INTEGER NOT NULL,
    `costPrice` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PurchaseOrder` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `poNumber` VARCHAR(191) NULL,
    `supplier` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `PurchaseOrder_poNumber_key`(`poNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PurchaseOrderItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `purchaseOrderId` INTEGER NOT NULL,
    `medicineId` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `unitPrice` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PharmacySale` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `publicId` VARCHAR(191) NOT NULL,
    `saleNumber` VARCHAR(191) NULL,
    `prescriptionId` INTEGER NULL,
    `pharmacistId` INTEGER NULL,
    `totalAmount` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    `paymentMode` ENUM('CASH', 'FIB', 'CARD', 'INSURANCE', 'NEFT', 'UPI', 'OTHER') NOT NULL,
    `paymentStatus` ENUM('PENDING', 'PAID', 'PARTIAL', 'REFUNDED', 'FAILED') NOT NULL DEFAULT 'PENDING',
    `referralCodeId` INTEGER NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `PharmacySale_publicId_key`(`publicId`),
    UNIQUE INDEX `PharmacySale_saleNumber_key`(`saleNumber`),
    UNIQUE INDEX `PharmacySale_prescriptionId_key`(`prescriptionId`),
    INDEX `PharmacySale_referralCodeId_paymentStatus_idx`(`referralCodeId`, `paymentStatus`),
    INDEX `PharmacySale_publicId_idx`(`publicId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PharmacySaleItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pharmacySaleId` INTEGER NOT NULL,
    `medicineId` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `unitPrice` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    `totalPrice` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PrescriptionItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `prescriptionId` INTEGER NOT NULL,
    `medicineId` INTEGER NOT NULL,
    `dosage` VARCHAR(191) NULL,
    `quantity` INTEGER NOT NULL,
    `durationDays` INTEGER NULL,
    `instructions` VARCHAR(191) NULL,

    INDEX `PrescriptionItem_prescriptionId_idx`(`prescriptionId`),
    INDEX `PrescriptionItem_medicineId_idx`(`medicineId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Prescription` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `publicId` VARCHAR(191) NOT NULL,
    `prescriptionNumber` VARCHAR(191) NULL,
    `patientId` INTEGER NOT NULL,
    `doctorId` INTEGER NULL,
    `issuedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `referralCodeId` INTEGER NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Prescription_publicId_key`(`publicId`),
    UNIQUE INDEX `Prescription_prescriptionNumber_key`(`prescriptionNumber`),
    INDEX `Prescription_publicId_idx`(`publicId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LabTestTemplate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `departmentId` INTEGER NULL,
    `price` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `LabTestTemplate_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LabRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `requestNumber` VARCHAR(191) NULL,
    `patientId` INTEGER NOT NULL,
    `doctorId` INTEGER NULL,
    `appointmentId` INTEGER NULL,
    `templateId` INTEGER NULL,
    `referralCodeId` INTEGER NULL,
    `status` ENUM('REQUESTED', 'IN_PROCESS', 'COMPLETED', 'CANCELLED', 'REVIEW_PENDING') NOT NULL DEFAULT 'REQUESTED',
    `requestedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `completedAt` DATETIME(3) NULL,
    `resultFileUrl` VARCHAR(191) NULL,
    `resultSummary` VARCHAR(191) NULL,
    `price` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    `paymentStatus` ENUM('PENDING', 'PAID', 'PARTIAL', 'REFUNDED', 'FAILED') NOT NULL DEFAULT 'PENDING',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `LabRequest_requestNumber_key`(`requestNumber`),
    INDEX `LabRequest_referralCodeId_status_idx`(`referralCodeId`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lab_results` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `publicId` VARCHAR(191) NOT NULL,
    `labRequestId` INTEGER NOT NULL,
    `resultantId` INTEGER NULL,
    `testName` VARCHAR(191) NULL,
    `resultSummary` TEXT NULL,
    `resultFileUrl` VARCHAR(191) NULL,
    `status` ENUM('NORMAL', 'ABNORMAL', 'CRITICAL', 'NOT_REPORTED') NOT NULL DEFAULT 'NOT_REPORTED',
    `resultedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `lab_results_publicId_key`(`publicId`),
    UNIQUE INDEX `lab_results_labRequestId_key`(`labRequestId`),
    INDEX `lab_results_resultantId_idx`(`resultantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RadiologyTemplate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `departmentId` INTEGER NULL,
    `price` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `RadiologyTemplate_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RadiologyRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `requestNumber` VARCHAR(191) NULL,
    `patientId` INTEGER NOT NULL,
    `doctorId` INTEGER NULL,
    `appointmentId` INTEGER NULL,
    `templateId` INTEGER NULL,
    `referralCodeId` INTEGER NULL,
    `status` ENUM('REQUESTED', 'IN_PROCESS', 'COMPLETED', 'CANCELLED', 'REVIEW_PENDING') NOT NULL DEFAULT 'REQUESTED',
    `requestedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `completedAt` DATETIME(3) NULL,
    `reportUrl` VARCHAR(191) NULL,
    `findings` VARCHAR(191) NULL,
    `price` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    `paymentStatus` ENUM('PENDING', 'PAID', 'PARTIAL', 'REFUNDED', 'FAILED') NOT NULL DEFAULT 'PENDING',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `RadiologyRequest_requestNumber_key`(`requestNumber`),
    INDEX `RadiologyRequest_referralCodeId_status_idx`(`referralCodeId`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Procedure` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `publicId` VARCHAR(191) NOT NULL,
    `procedureNumber` VARCHAR(191) NULL,
    `patientId` INTEGER NOT NULL,
    `performedById` INTEGER NULL,
    `procedureType` VARCHAR(191) NULL,
    `scheduledAt` DATETIME(3) NULL,
    `status` VARCHAR(191) NULL,
    `referralCodeId` INTEGER NULL,
    `notes` VARCHAR(191) NULL,
    `operatingRoom` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Procedure_publicId_key`(`publicId`),
    UNIQUE INDEX `Procedure_procedureNumber_key`(`procedureNumber`),
    INDEX `Procedure_referralCodeId_scheduledAt_idx`(`referralCodeId`, `scheduledAt`),
    INDEX `Procedure_publicId_idx`(`publicId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProcedureTeam` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `procedureId` INTEGER NOT NULL,
    `memberId` INTEGER NOT NULL,
    `memberRole` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Invoice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `publicId` VARCHAR(191) NOT NULL,
    `invoiceNumber` VARCHAR(191) NOT NULL,
    `invoiceType` ENUM('CONSULTATION', 'LAB', 'RADIOLOGY', 'PHARMACY', 'PROCEDURE', 'ADMISSION', 'OTHER') NOT NULL,
    `appointmentId` INTEGER NULL,
    `admissionId` VARCHAR(191) NULL,
    `pharmacySaleId` INTEGER NULL,
    `labRequestId` INTEGER NULL,
    `radiologyRequestId` INTEGER NULL,
    `procedureId` INTEGER NULL,
    `patientId` INTEGER NOT NULL,
    `totalAmount` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    `paidAmount` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    `paymentMode` ENUM('CASH', 'FIB', 'CARD', 'INSURANCE', 'NEFT', 'UPI', 'OTHER') NULL,
    `paymentStatus` ENUM('PENDING', 'PAID', 'PARTIAL', 'REFUNDED', 'FAILED') NOT NULL DEFAULT 'PENDING',
    `issuedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dueAt` DATETIME(3) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Invoice_publicId_key`(`publicId`),
    UNIQUE INDEX `Invoice_invoiceNumber_key`(`invoiceNumber`),
    INDEX `Invoice_patientId_paymentStatus_idx`(`patientId`, `paymentStatus`),
    INDEX `Invoice_publicId_idx`(`publicId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InvoiceItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `invoiceId` INTEGER NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `unitPrice` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    `total` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `invoiceId` INTEGER NOT NULL,
    `amount` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    `paymentMode` ENUM('CASH', 'FIB', 'CARD', 'INSURANCE', 'NEFT', 'UPI', 'OTHER') NOT NULL,
    `paymentRef` VARCHAR(191) NULL,
    `paidAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('PENDING', 'PAID', 'PARTIAL', 'REFUNDED', 'FAILED') NOT NULL DEFAULT 'PAID',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Payment_invoiceId_status_idx`(`invoiceId`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `insurance_claims` (
    `id` VARCHAR(191) NOT NULL,
    `claimNumber` VARCHAR(191) NOT NULL,
    `invoiceId` INTEGER NOT NULL,
    `patientId` INTEGER NOT NULL,
    `insuranceProvider` VARCHAR(191) NOT NULL,
    `policyNumber` VARCHAR(191) NOT NULL,
    `claimAmount` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    `approvedAmount` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    `submissionDate` DATETIME(3) NOT NULL,
    `approvalDate` DATETIME(3) NULL,
    `status` ENUM('SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'SETTLED') NOT NULL DEFAULT 'SUBMITTED',
    `remarks` VARCHAR(191) NULL,
    `documents` JSON NULL,
    `processedBy` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `insurance_claims_claimNumber_key`(`claimNumber`),
    INDEX `insurance_claims_patientId_status_idx`(`patientId`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Expense` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    `expenseDate` DATETIME(3) NOT NULL,
    `departmentId` INTEGER NULL,
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DepartmentRevenue` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `departmentId` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `totalAmount` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,

    INDEX `DepartmentRevenue_departmentId_date_idx`(`departmentId`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MedicationLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nurseId` INTEGER NOT NULL,
    `patientId` INTEGER NOT NULL,
    `medicineId` INTEGER NULL,
    `dosage` VARCHAR(191) NULL,
    `administeredAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `notes` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NurseNote` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nurseId` INTEGER NOT NULL,
    `patientId` INTEGER NOT NULL,
    `note` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Attachment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NULL,
    `meta` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Setting` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `group` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Setting_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BloodDonor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `donorCode` VARCHAR(191) NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NULL,
    `contact` VARCHAR(191) NULL,
    `bloodType` ENUM('A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG', 'UNKNOWN') NOT NULL,
    `lastDonated` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `BloodDonor_donorCode_key`(`donorCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BloodInventory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `publicId` VARCHAR(191) NOT NULL,
    `donorId` INTEGER NULL,
    `bloodType` ENUM('A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG', 'UNKNOWN') NOT NULL,
    `units` INTEGER NOT NULL DEFAULT 1,
    `collectedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiryAt` DATETIME(3) NULL,
    `status` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `BloodInventory_publicId_key`(`publicId`),
    INDEX `BloodInventory_bloodType_status_idx`(`bloodType`, `status`),
    INDEX `BloodInventory_publicId_idx`(`publicId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BloodRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `publicId` VARCHAR(191) NOT NULL,
    `requestNumber` VARCHAR(191) NULL,
    `inventoryId` INTEGER NULL,
    `patientId` INTEGER NULL,
    `requestedById` INTEGER NULL,
    `doctorId` INTEGER NULL,
    `referralCodeId` INTEGER NULL,
    `unitsRequested` INTEGER NOT NULL DEFAULT 1,
    `unitsIssued` INTEGER NULL,
    `issueDate` DATETIME(3) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'REQUESTED',
    `commissionAmount` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    `notes` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `BloodRequest_publicId_key`(`publicId`),
    UNIQUE INDEX `BloodRequest_requestNumber_key`(`requestNumber`),
    INDEX `BloodRequest_doctorId_referralCodeId_status_idx`(`doctorId`, `referralCodeId`, `status`),
    INDEX `BloodRequest_publicId_idx`(`publicId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vitals` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `patientId` INTEGER NOT NULL,
    `recordedById` INTEGER NULL,
    `temperature` DOUBLE NULL,
    `pulse` DOUBLE NULL,
    `bloodPressureSystolic` DOUBLE NULL,
    `bloodPressureDiastolic` DOUBLE NULL,
    `respiratoryRate` DOUBLE NULL,
    `spo2` DOUBLE NULL,
    `weight` DOUBLE NULL,
    `height` DOUBLE NULL,
    `bmi` DOUBLE NULL,
    `remarks` VARCHAR(191) NULL,
    `recordedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `vitals_patientId_recordedAt_idx`(`patientId`, `recordedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `refunds` (
    `id` VARCHAR(191) NOT NULL,
    `invoiceId` INTEGER NOT NULL,
    `paymentId` INTEGER NOT NULL,
    `patientId` INTEGER NOT NULL,
    `refundAmount` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    `refundMode` ENUM('CASH', 'CARD', 'UPI', 'BANK_TRANSFER', 'CHEQUE') NOT NULL,
    `transactionRef` VARCHAR(191) NULL,
    `refundReason` ENUM('CANCELLED_APPOINTMENT', 'BILLING_ERROR', 'RETURNED_MEDICINE', 'INSURANCE_ADJUSTMENT', 'OTHER') NOT NULL,
    `processedBy` INTEGER NULL,
    `refundDate` DATETIME(3) NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    `remarks` VARCHAR(191) NULL,
    `attachment` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `refunds_patientId_status_refundDate_idx`(`patientId`, `status`, `refundDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DutyRoster` (
    `id` VARCHAR(191) NOT NULL,
    `rosterName` VARCHAR(191) NOT NULL,
    `departmentId` INTEGER NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `shiftType` ENUM('STRAIGHT', 'BREAK_SHIFT', 'ROTATIONAL') NOT NULL DEFAULT 'STRAIGHT',
    `isPublished` BOOLEAN NOT NULL DEFAULT false,
    `createdById` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `DutyRoster_departmentId_startDate_endDate_idx`(`departmentId`, `startDate`, `endDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DutyAssignment` (
    `id` VARCHAR(191) NOT NULL,
    `rosterId` VARCHAR(191) NOT NULL,
    `staffId` INTEGER NOT NULL,
    `roleId` INTEGER NULL,
    `date` DATETIME(3) NOT NULL,
    `dayOfWeek` ENUM('MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN') NOT NULL,
    `status` ENUM('SCHEDULED', 'ON_LEAVE', 'OFF_DUTY') NOT NULL DEFAULT 'SCHEDULED',
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `DutyAssignment_rosterId_date_idx`(`rosterId`, `date`),
    INDEX `DutyAssignment_staffId_date_idx`(`staffId`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `housekeeping_tasks` (
    `id` VARCHAR(191) NOT NULL,
    `assignedStaffId` VARCHAR(191) NOT NULL,
    `area` VARCHAR(191) NOT NULL,
    `taskType` ENUM('CLEANING', 'MAINTENANCE', 'WASTE_DISPOSAL', 'SANITIZATION') NOT NULL,
    `priority` ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL DEFAULT 'MEDIUM',
    `scheduledDate` DATETIME(3) NOT NULL,
    `completionDate` DATETIME(3) NULL,
    `status` ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'VERIFIED') NOT NULL DEFAULT 'PENDING',
    `verificationBy` INTEGER NULL,
    `remarks` VARCHAR(191) NULL,
    `photoEvidence` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `housekeeping_tasks_assignedStaffId_status_idx`(`assignedStaffId`, `status`),
    INDEX `housekeeping_tasks_verificationBy_status_idx`(`verificationBy`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_AppointmentPrescriptions` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_AppointmentPrescriptions_AB_unique`(`A`, `B`),
    INDEX `_AppointmentPrescriptions_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuditLog` ADD CONSTRAINT `AuditLog_performedBy_fkey` FOREIGN KEY (`performedBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Patient` ADD CONSTRAINT `Patient_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Doctor` ADD CONSTRAINT `Doctor_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Doctor` ADD CONSTRAINT `Doctor_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `Department`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Nurse` ADD CONSTRAINT `Nurse_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pharmacist` ADD CONSTRAINT `Pharmacist_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StaffAttendance` ADD CONSTRAINT `StaffAttendance_staffId_fkey` FOREIGN KEY (`staffId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Room` ADD CONSTRAINT `Room_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `Department`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bed` ADD CONSTRAINT `Bed_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Admission` ADD CONSTRAINT `Admission_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Admission` ADD CONSTRAINT `Admission_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Admission` ADD CONSTRAINT `Admission_bedId_fkey` FOREIGN KEY (`bedId`) REFERENCES `Bed`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `Department`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_referralCodeId_fkey` FOREIGN KEY (`referralCodeId`) REFERENCES `ReferralCode`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MedicalRecord` ADD CONSTRAINT `MedicalRecord_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MedicalRecord` ADD CONSTRAINT `MedicalRecord_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FollowUp` ADD CONSTRAINT `FollowUp_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FollowUp` ADD CONSTRAINT `FollowUp_appointmentId_fkey` FOREIGN KEY (`appointmentId`) REFERENCES `Appointment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FollowUp` ADD CONSTRAINT `FollowUp_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReferralCode` ADD CONSTRAINT `ReferralCode_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommissionSetup` ADD CONSTRAINT `CommissionSetup_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommissionSetup` ADD CONSTRAINT `CommissionSetup_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommissionSetup` ADD CONSTRAINT `CommissionSetup_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `Department`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommissionSetup` ADD CONSTRAINT `CommissionSetup_referralCodeId_fkey` FOREIGN KEY (`referralCodeId`) REFERENCES `ReferralCode`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommissionTransaction` ADD CONSTRAINT `CommissionTransaction_referralCodeId_fkey` FOREIGN KEY (`referralCodeId`) REFERENCES `ReferralCode`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommissionTransaction` ADD CONSTRAINT `CommissionTransaction_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommissionTransaction` ADD CONSTRAINT `CommissionTransaction_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `Department`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommissionTransaction` ADD CONSTRAINT `CommissionTransaction_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `Invoice`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommissionPayout` ADD CONSTRAINT `CommissionPayout_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommissionPayoutItem` ADD CONSTRAINT `CommissionPayoutItem_commissionPayoutId_fkey` FOREIGN KEY (`commissionPayoutId`) REFERENCES `CommissionPayout`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommissionPayoutItem` ADD CONSTRAINT `CommissionPayoutItem_commissionTransactionId_fkey` FOREIGN KEY (`commissionTransactionId`) REFERENCES `CommissionTransaction`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DoctorEarning` ADD CONSTRAINT `DoctorEarning_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PharmacyStock` ADD CONSTRAINT `PharmacyStock_medicineId_fkey` FOREIGN KEY (`medicineId`) REFERENCES `Medicine`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseOrderItem` ADD CONSTRAINT `PurchaseOrderItem_purchaseOrderId_fkey` FOREIGN KEY (`purchaseOrderId`) REFERENCES `PurchaseOrder`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseOrderItem` ADD CONSTRAINT `PurchaseOrderItem_medicineId_fkey` FOREIGN KEY (`medicineId`) REFERENCES `Medicine`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PharmacySale` ADD CONSTRAINT `PharmacySale_prescriptionId_fkey` FOREIGN KEY (`prescriptionId`) REFERENCES `Prescription`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PharmacySale` ADD CONSTRAINT `PharmacySale_pharmacistId_fkey` FOREIGN KEY (`pharmacistId`) REFERENCES `Pharmacist`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PharmacySale` ADD CONSTRAINT `PharmacySale_referralCodeId_fkey` FOREIGN KEY (`referralCodeId`) REFERENCES `ReferralCode`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PharmacySale` ADD CONSTRAINT `PharmacySale_ProcessedBy_fkey` FOREIGN KEY (`pharmacistId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PharmacySaleItem` ADD CONSTRAINT `PharmacySaleItem_pharmacySaleId_fkey` FOREIGN KEY (`pharmacySaleId`) REFERENCES `PharmacySale`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PharmacySaleItem` ADD CONSTRAINT `PharmacySaleItem_medicineId_fkey` FOREIGN KEY (`medicineId`) REFERENCES `Medicine`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PrescriptionItem` ADD CONSTRAINT `PrescriptionItem_prescriptionId_fkey` FOREIGN KEY (`prescriptionId`) REFERENCES `Prescription`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PrescriptionItem` ADD CONSTRAINT `PrescriptionItem_medicineId_fkey` FOREIGN KEY (`medicineId`) REFERENCES `Medicine`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Prescription` ADD CONSTRAINT `Prescription_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Prescription` ADD CONSTRAINT `Prescription_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Prescription` ADD CONSTRAINT `Prescription_referralCodeId_fkey` FOREIGN KEY (`referralCodeId`) REFERENCES `ReferralCode`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LabTestTemplate` ADD CONSTRAINT `LabTestTemplate_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `Department`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LabRequest` ADD CONSTRAINT `LabRequest_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LabRequest` ADD CONSTRAINT `LabRequest_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LabRequest` ADD CONSTRAINT `LabRequest_appointmentId_fkey` FOREIGN KEY (`appointmentId`) REFERENCES `Appointment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LabRequest` ADD CONSTRAINT `LabRequest_templateId_fkey` FOREIGN KEY (`templateId`) REFERENCES `LabTestTemplate`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LabRequest` ADD CONSTRAINT `LabRequest_referralCodeId_fkey` FOREIGN KEY (`referralCodeId`) REFERENCES `ReferralCode`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lab_results` ADD CONSTRAINT `lab_results_labRequestId_fkey` FOREIGN KEY (`labRequestId`) REFERENCES `LabRequest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lab_results` ADD CONSTRAINT `lab_results_resultantId_fkey` FOREIGN KEY (`resultantId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RadiologyTemplate` ADD CONSTRAINT `RadiologyTemplate_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `Department`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RadiologyRequest` ADD CONSTRAINT `RadiologyRequest_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RadiologyRequest` ADD CONSTRAINT `RadiologyRequest_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RadiologyRequest` ADD CONSTRAINT `RadiologyRequest_appointmentId_fkey` FOREIGN KEY (`appointmentId`) REFERENCES `Appointment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RadiologyRequest` ADD CONSTRAINT `RadiologyRequest_templateId_fkey` FOREIGN KEY (`templateId`) REFERENCES `RadiologyTemplate`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RadiologyRequest` ADD CONSTRAINT `RadiologyRequest_referralCodeId_fkey` FOREIGN KEY (`referralCodeId`) REFERENCES `ReferralCode`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Procedure` ADD CONSTRAINT `Procedure_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Procedure` ADD CONSTRAINT `Procedure_performedById_fkey` FOREIGN KEY (`performedById`) REFERENCES `Doctor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Procedure` ADD CONSTRAINT `Procedure_referralCodeId_fkey` FOREIGN KEY (`referralCodeId`) REFERENCES `ReferralCode`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProcedureTeam` ADD CONSTRAINT `ProcedureTeam_procedureId_fkey` FOREIGN KEY (`procedureId`) REFERENCES `Procedure`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProcedureTeam` ADD CONSTRAINT `ProcedureTeam_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `Doctor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_appointmentId_fkey` FOREIGN KEY (`appointmentId`) REFERENCES `Appointment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_admissionId_fkey` FOREIGN KEY (`admissionId`) REFERENCES `Admission`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_pharmacySaleId_fkey` FOREIGN KEY (`pharmacySaleId`) REFERENCES `PharmacySale`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_labRequestId_fkey` FOREIGN KEY (`labRequestId`) REFERENCES `LabRequest`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_radiologyRequestId_fkey` FOREIGN KEY (`radiologyRequestId`) REFERENCES `RadiologyRequest`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_procedureId_fkey` FOREIGN KEY (`procedureId`) REFERENCES `Procedure`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceItem` ADD CONSTRAINT `InvoiceItem_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `Invoice`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `Invoice`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `insurance_claims` ADD CONSTRAINT `insurance_claims_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `Invoice`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `insurance_claims` ADD CONSTRAINT `insurance_claims_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `insurance_claims` ADD CONSTRAINT `insurance_claims_processedBy_fkey` FOREIGN KEY (`processedBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Expense` ADD CONSTRAINT `Expense_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `Department`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DepartmentRevenue` ADD CONSTRAINT `DepartmentRevenue_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `Department`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MedicationLog` ADD CONSTRAINT `MedicationLog_nurseId_fkey` FOREIGN KEY (`nurseId`) REFERENCES `Nurse`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MedicationLog` ADD CONSTRAINT `MedicationLog_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MedicationLog` ADD CONSTRAINT `MedicationLog_medicineId_fkey` FOREIGN KEY (`medicineId`) REFERENCES `Medicine`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NurseNote` ADD CONSTRAINT `NurseNote_nurseId_fkey` FOREIGN KEY (`nurseId`) REFERENCES `Nurse`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NurseNote` ADD CONSTRAINT `NurseNote_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BloodInventory` ADD CONSTRAINT `BloodInventory_donorId_fkey` FOREIGN KEY (`donorId`) REFERENCES `BloodDonor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BloodRequest` ADD CONSTRAINT `BloodRequest_inventoryId_fkey` FOREIGN KEY (`inventoryId`) REFERENCES `BloodInventory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BloodRequest` ADD CONSTRAINT `BloodRequest_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BloodRequest` ADD CONSTRAINT `BloodRequest_requestedById_fkey` FOREIGN KEY (`requestedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BloodRequest` ADD CONSTRAINT `BloodRequest_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BloodRequest` ADD CONSTRAINT `BloodRequest_referralCodeId_fkey` FOREIGN KEY (`referralCodeId`) REFERENCES `ReferralCode`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vitals` ADD CONSTRAINT `vitals_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vitals` ADD CONSTRAINT `vitals_recordedById_fkey` FOREIGN KEY (`recordedById`) REFERENCES `Doctor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refunds` ADD CONSTRAINT `refunds_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `Invoice`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refunds` ADD CONSTRAINT `refunds_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `Payment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refunds` ADD CONSTRAINT `refunds_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refunds` ADD CONSTRAINT `refunds_processedBy_fkey` FOREIGN KEY (`processedBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DutyRoster` ADD CONSTRAINT `DutyRoster_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `Department`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DutyRoster` ADD CONSTRAINT `DutyRoster_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DutyAssignment` ADD CONSTRAINT `DutyAssignment_rosterId_fkey` FOREIGN KEY (`rosterId`) REFERENCES `DutyRoster`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DutyAssignment` ADD CONSTRAINT `DutyAssignment_staffId_fkey` FOREIGN KEY (`staffId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DutyAssignment` ADD CONSTRAINT `DutyAssignment_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `housekeeping_tasks` ADD CONSTRAINT `housekeeping_tasks_assignedStaffId_fkey` FOREIGN KEY (`assignedStaffId`) REFERENCES `StaffAttendance`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `housekeeping_tasks` ADD CONSTRAINT `housekeeping_tasks_verificationBy_fkey` FOREIGN KEY (`verificationBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AppointmentPrescriptions` ADD CONSTRAINT `_AppointmentPrescriptions_A_fkey` FOREIGN KEY (`A`) REFERENCES `Appointment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AppointmentPrescriptions` ADD CONSTRAINT `_AppointmentPrescriptions_B_fkey` FOREIGN KEY (`B`) REFERENCES `Prescription`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
