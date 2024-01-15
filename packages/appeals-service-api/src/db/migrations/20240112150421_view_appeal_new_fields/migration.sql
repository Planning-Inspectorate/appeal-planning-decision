BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AppealCase] ADD [appellantCasePublished] BIT NOT NULL CONSTRAINT [AppealCase_appellantCasePublished_df] DEFAULT 0,
[appellantFinalCommentsSubmitted] BIT NOT NULL CONSTRAINT [AppealCase_appellantFinalCommentsSubmitted_df] DEFAULT 0,
[appellantFirstName] NVARCHAR(1000) NOT NULL CONSTRAINT [AppealCase_appellantFirstName_df] DEFAULT '',
[appellantLastName] NVARCHAR(1000) NOT NULL CONSTRAINT [AppealCase_appellantLastName_df] DEFAULT '',
[appellantProofEvidencePublished] BIT NOT NULL CONSTRAINT [AppealCase_appellantProofEvidencePublished_df] DEFAULT 0,
[appellantProofEvidenceSubmitted] BIT NOT NULL CONSTRAINT [AppealCase_appellantProofEvidenceSubmitted_df] DEFAULT 0,
[caseDecisionOutcome] NVARCHAR(1000),
[interestedPartyCommentsPublished] BIT NOT NULL CONSTRAINT [AppealCase_interestedPartyCommentsPublished_df] DEFAULT 0,
[lpaFinalCommentsPublished] BIT NOT NULL CONSTRAINT [AppealCase_lpaFinalCommentsPublished_df] DEFAULT 0,
[lpaProofEvidencePublished] BIT NOT NULL CONSTRAINT [AppealCase_lpaProofEvidencePublished_df] DEFAULT 0,
[lpaProofEvidenceSubmitted] BIT NOT NULL CONSTRAINT [AppealCase_lpaProofEvidenceSubmitted_df] DEFAULT 0,
[lpaQuestionnairePublished] BIT NOT NULL CONSTRAINT [AppealCase_lpaQuestionnairePublished_df] DEFAULT 0,
[lpaQuestionnaireSubmitted] BIT NOT NULL CONSTRAINT [AppealCase_lpaQuestionnaireSubmitted_df] DEFAULT 0,
[procedure] NVARCHAR(1000),
[rule6StatementPublished] BIT NOT NULL CONSTRAINT [AppealCase_rule6StatementPublished_df] DEFAULT 0;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
