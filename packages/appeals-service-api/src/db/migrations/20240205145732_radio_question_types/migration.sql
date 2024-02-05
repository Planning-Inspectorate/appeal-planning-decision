BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] ALTER COLUMN [lpaSiteAccess] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] ALTER COLUMN [neighbourSiteAccess] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] ALTER COLUMN [lpaSiteSafetyRisks] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] ALTER COLUMN [newConditions] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] ALTER COLUMN [statutoryConsultees] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] ALTER COLUMN [sensitiveArea] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] ALTER COLUMN [requiresEnvironmentalStatement] NVARCHAR(1000) NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
