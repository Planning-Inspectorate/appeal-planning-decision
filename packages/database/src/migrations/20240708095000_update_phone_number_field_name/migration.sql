/*
  Warnings:

  - You are about to drop the column `appellantPhoneNumber` on the `AppellantSubmission` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AppellantSubmission] DROP COLUMN [appellantPhoneNumber];
ALTER TABLE [dbo].[AppellantSubmission] ADD [contactPhoneNumber] NVARCHAR(1000);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
