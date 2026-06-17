BEGIN TRY

BEGIN TRAN;

-- DropIndex
DROP INDEX [AppellantFinalCommentSubmission_caseReference_idx] ON [dbo].[AppellantFinalCommentSubmission];

-- DropIndex
DROP INDEX [AppellantProofOfEvidenceSubmission_caseReference_idx] ON [dbo].[AppellantProofOfEvidenceSubmission];

-- DropIndex
DROP INDEX [AppellantStatementSubmission_appealCaseReference_idx] ON [dbo].[AppellantStatementSubmission];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
