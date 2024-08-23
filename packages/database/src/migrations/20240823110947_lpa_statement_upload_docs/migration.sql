BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[LPAStatementSubmission] DROP CONSTRAINT [LPAStatementSubmission_additionalDocuments_df];
ALTER TABLE [dbo].[LPAStatementSubmission] ALTER COLUMN [additionalDocuments] BIT NULL;
ALTER TABLE [dbo].[LPAStatementSubmission] ADD [uploadLpaStatementDocuments] BIT;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
