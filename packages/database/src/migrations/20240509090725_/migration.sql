/*
  Warnings:

  - You are about to alter the column `siteAreaSquareMetres` on the `AppellantSubmission` table. The data in that column could be lost. The data in that column will be cast from `Float(53)` to `Decimal(32,16)`.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AppellantSubmission] ALTER COLUMN [siteAreaSquareMetres] DECIMAL(32,16) NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
