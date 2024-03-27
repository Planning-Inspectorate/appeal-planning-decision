BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[SubmissionDocumentUpload] ADD CONSTRAINT [SubmissionDocumentUpload_storageId_df] DEFAULT '' FOR [storageId];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
