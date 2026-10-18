/*
  Warnings:

  - Added the required column `contactEmail` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `company` ADD COLUMN `contactEmail` VARCHAR(191) NOT NULL;
