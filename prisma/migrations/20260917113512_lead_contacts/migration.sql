-- AlterTable: email is no longer required (company-only imports may not
-- have one yet); the existing unique index on `email` is left in place —
-- MySQL permits multiple NULLs in a unique index.
ALTER TABLE `leads`
    MODIFY COLUMN `email` VARCHAR(190) NULL;

-- AlterTable: website becomes the de-dupe key for company-only imports.
ALTER TABLE `leads`
    ADD UNIQUE INDEX `leads_website_key`(`website`);

-- CreateTable
CREATE TABLE `lead_contacts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lead_id` INTEGER NOT NULL,
    `name` VARCHAR(160) NULL,
    `first_name` VARCHAR(80) NULL,
    `last_name` VARCHAR(80) NULL,
    `job_title` VARCHAR(160) NULL,
    `department` VARCHAR(120) NULL,
    `seniority_level` VARCHAR(60) NULL,
    `role_category` VARCHAR(60) NULL,
    `decision_maker` BOOLEAN NOT NULL DEFAULT false,
    `work_email` VARCHAR(190) NULL,
    `mobile_phone` VARCHAR(32) NULL,
    `office_phone` VARCHAR(32) NULL,
    `linkedin` VARCHAR(300) NULL,
    `twitter` VARCHAR(300) NULL,
    `facebook` VARCHAR(300) NULL,
    `city` VARCHAR(120) NULL,
    `state` VARCHAR(120) NULL,
    `country` VARCHAR(120) NULL,
    `source_url` VARCHAR(300) NULL,
    `verified` BOOLEAN NOT NULL DEFAULT false,
    `confidence_score` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `lead_contacts_work_email_key`(`work_email`),
    INDEX `lead_contacts_lead_id_idx`(`lead_id`),
    INDEX `lead_contacts_decision_maker_idx`(`decision_maker`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `lead_contacts` ADD CONSTRAINT `lead_contacts_lead_id_fkey` FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
