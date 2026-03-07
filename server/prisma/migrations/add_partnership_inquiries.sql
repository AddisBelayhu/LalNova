-- Create partnership_inquiries table
CREATE TABLE IF NOT EXISTS `partnership_inquiries` (
  `id` VARCHAR(191) NOT NULL,
  `partnership_name` VARCHAR(191) NOT NULL,
  `partner_type` VARCHAR(191) NOT NULL,
  `street_address` VARCHAR(191) NOT NULL,
  `city` VARCHAR(191) NOT NULL,
  `state_region` VARCHAR(191) NULL,
  `zip_code` VARCHAR(191) NOT NULL,
  `country` VARCHAR(191) NOT NULL,
  `contact_name` VARCHAR(191) NOT NULL,
  `contact_email` VARCHAR(191) NOT NULL,
  `phone_number` VARCHAR(191) NOT NULL,
  `message` TEXT NULL,
  `keep_updated` BOOLEAN NOT NULL DEFAULT false,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
