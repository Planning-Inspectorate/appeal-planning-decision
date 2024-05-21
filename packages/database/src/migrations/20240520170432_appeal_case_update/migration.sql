/*
  Warnings:

  - You are about to drop the column `yourCompanyName` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `yourFirstName` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `yourLastName` on the `AppealCase` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AppealCase] DROP COLUMN [yourCompanyName],
[yourFirstName],
[yourLastName];
ALTER TABLE [dbo].[AppealCase] ADD [appellantCompanyName] NVARCHAR(1000),
[contactCompanyName] NVARCHAR(1000),
[contactFirstName] NVARCHAR(1000),
[contactLastName] NVARCHAR(1000);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
