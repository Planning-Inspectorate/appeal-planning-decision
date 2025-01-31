/*
  Warnings:

  - You are about to drop the column `invalidDetails` on the `Representation` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Representation` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Representation] DROP COLUMN [invalidDetails],
[status];
ALTER TABLE [dbo].[Representation] ADD [invalidOrIncompleteDetails] NVARCHAR(1000),
[otherInvalidOrIncompleteDetails] NVARCHAR(1000),
[representationStatus] NVARCHAR(1000);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
