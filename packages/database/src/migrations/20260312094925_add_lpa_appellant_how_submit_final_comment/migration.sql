BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AppellantFinalCommentSubmission] ADD [appellantHowSubmitFinalComment] NVARCHAR(20);

-- AlterTable
ALTER TABLE [dbo].[LPAFinalCommentSubmission] ADD [lpaHowSubmitFinalComment] NVARCHAR(20);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
