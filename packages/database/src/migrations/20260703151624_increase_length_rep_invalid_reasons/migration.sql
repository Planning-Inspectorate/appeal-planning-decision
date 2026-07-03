BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Representation] ALTER COLUMN [invalidOrIncompleteDetails] NVARCHAR(max) NULL;
ALTER TABLE [dbo].[Representation] ALTER COLUMN [otherInvalidOrIncompleteDetails] NVARCHAR(max) NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
