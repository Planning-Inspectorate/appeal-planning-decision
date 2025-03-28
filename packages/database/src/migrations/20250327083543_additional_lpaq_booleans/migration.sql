BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] ADD [developmentPlanPolicies] BIT,
[otherRelevantPolicies] BIT;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
