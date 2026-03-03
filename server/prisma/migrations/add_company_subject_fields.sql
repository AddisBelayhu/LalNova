-- Add company and subject fields to contact_messages table
ALTER TABLE `contact_messages` 
ADD COLUMN `company` VARCHAR(191) NULL AFTER `name`,
ADD COLUMN `subject` VARCHAR(191) NOT NULL AFTER `phone`;
