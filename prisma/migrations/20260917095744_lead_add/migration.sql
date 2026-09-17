-- CreateTable
CREATE TABLE `leads` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `company_name` VARCHAR(160) NOT NULL,
    `contact_name` VARCHAR(120) NULL,
    `email` VARCHAR(190) NOT NULL,
    `phone` VARCHAR(32) NULL,
    `industry` VARCHAR(80) NULL,
    `status` ENUM('NEW', 'CONTACTED', 'QUALIFIED', 'EXHIBITING', 'DECLINED') NOT NULL DEFAULT 'NEW',
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `leads_email_key`(`email`),
    INDEX `leads_status_idx`(`status`),
    INDEX `leads_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lead_social_profiles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lead_id` INTEGER NOT NULL,
    `platform` VARCHAR(40) NOT NULL,
    `url` VARCHAR(300) NOT NULL,

    INDEX `lead_social_profiles_lead_id_idx`(`lead_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `lead_social_profiles` ADD CONSTRAINT `lead_social_profiles_lead_id_fkey` FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
