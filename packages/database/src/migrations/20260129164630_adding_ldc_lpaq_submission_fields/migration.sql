BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] ADD [appealUnderActSection] NVARCHAR(1000),
[lpaAppealInvalidReasons] NVARCHAR(max),
[lpaConsiderAppealInvalid] BIT;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
