/*
  Warnings:

  - You are about to drop the column `serviceUserId` on the `AppealUser` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
DROP INDEX [idx_AppealUser_serviceUserId_unique_notnull] ON [dbo].[AppealUser]
ALTER TABLE [dbo].[AppealUser] DROP COLUMN [serviceUserId];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
