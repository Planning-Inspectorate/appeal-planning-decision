BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] ADD [anySignificantChanges] NVARCHAR(1000),
[anySignificantChanges_courtJudgementSignificantChanges] NVARCHAR(max),
[anySignificantChanges_localPlanSignificantChanges] NVARCHAR(max),
[anySignificantChanges_nationalPolicySignificantChanges] NVARCHAR(max),
[anySignificantChanges_otherSignificantChanges] NVARCHAR(max);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
