BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AppealCase] ADD [rule6ProofEvidenceDueDate] DATETIME2,
[rule6ProofEvidenceSubmitted] BIT NOT NULL CONSTRAINT [AppealCase_rule6ProofEvidenceSubmitted_df] DEFAULT 0,
[rule6StatementDueDate] DATETIME2,
[rule6StatementSubmitted] BIT NOT NULL CONSTRAINT [AppealCase_rule6StatementSubmitted_df] DEFAULT 0;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
