-- AlterTable
ALTER TABLE `leads`
    ADD COLUMN `website` VARCHAR(300) NULL,
    ADD COLUMN `lead_source` VARCHAR(120) NULL,
    ADD COLUMN `lead_owner` VARCHAR(120) NULL,
    ADD COLUMN `lead_score` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `priority` ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL DEFAULT 'MEDIUM',
    ADD COLUMN `last_contacted_at` DATETIME(3) NULL,
    ADD COLUMN `next_follow_up_at` DATETIME(3) NULL,
    ADD COLUMN `profile` JSON NULL;

-- CreateIndex
CREATE INDEX `leads_priority_idx` ON `leads`(`priority`);

-- CreateIndex
CREATE INDEX `leads_lead_score_idx` ON `leads`(`lead_score`);
