BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AppellantSubmission]
ADD [anySignificantChanges] NVARCHAR(1000),
    [anySignificantChanges_otherSignificantChanges] NVARCHAR(MAX);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
