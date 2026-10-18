-- DropForeignKey
ALTER TABLE `projectfile` DROP FOREIGN KEY `ProjectFile_projectId_fkey`;

-- AddForeignKey
ALTER TABLE `ProjectFile` ADD CONSTRAINT `ProjectFile_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
