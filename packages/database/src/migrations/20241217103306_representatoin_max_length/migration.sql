BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Representation] ALTER COLUMN [originalRepresentation] NVARCHAR(max) NULL;
ALTER TABLE [dbo].[Representation] ALTER COLUMN [redactedRepresentation] NVARCHAR(max) NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
