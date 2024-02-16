BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AppealCase] ADD [caseDecisionPublished] BIT CONSTRAINT [AppealCase_caseDecisionPublished_df] DEFAULT 0,
[lpaStatementPublished] BIT NOT NULL CONSTRAINT [AppealCase_lpaStatementPublished_df] DEFAULT 0,
[rule6ProofsEvidencePublished] BIT NOT NULL CONSTRAINT [AppealCase_rule6ProofsEvidencePublished_df] DEFAULT 0;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
