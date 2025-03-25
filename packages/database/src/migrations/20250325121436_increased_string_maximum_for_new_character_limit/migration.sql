BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AppellantSubmission] ALTER COLUMN [siteAreaUnits] NVARCHAR(max) NULL;

-- AlterTable
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] ALTER COLUMN [lpaSiteAccess] NVARCHAR(max) NULL;
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] ALTER COLUMN [neighbourSiteAccess] NVARCHAR(max) NULL;
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] ALTER COLUMN [lpaSiteSafetyRisks] NVARCHAR(max) NULL;
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] ALTER COLUMN [newConditions] NVARCHAR(max) NULL;
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] ALTER COLUMN [statutoryConsultees] NVARCHAR(max) NULL;
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] ALTER COLUMN [sensitiveArea] NVARCHAR(max) NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
