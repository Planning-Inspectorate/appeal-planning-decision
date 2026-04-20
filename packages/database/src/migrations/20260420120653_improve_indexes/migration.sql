BEGIN TRY

BEGIN TRAN;

-- DropIndex
DROP INDEX [AppealCaseRelationship_type_idx] ON [dbo].[AppealCaseRelationship];

-- DropIndex
DROP INDEX [LPAFinalCommentSubmission_caseReference_idx] ON [dbo].[LPAFinalCommentSubmission];

-- DropIndex
DROP INDEX [LPAProofOfEvidenceSubmission_caseReference_idx] ON [dbo].[LPAProofOfEvidenceSubmission];

-- DropIndex
DROP INDEX [LPAStatementSubmission_appealCaseReference_idx] ON [dbo].[LPAStatementSubmission];

-- CreateIndex
CREATE NONCLUSTERED INDEX [AppealCaseRelationship_type_caseReference_caseReference2_idx] ON [dbo].[AppealCaseRelationship]([type], [caseReference], [caseReference2]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [ServiceUser_id_caseReference_idx] ON [dbo].[ServiceUser]([id], [caseReference]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
