BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] ADD [enforcementNoticeDateApplication] BIT,
[enforcementNoticeDateApplicationUpload] BIT,
[enforcementNoticePlanUpload] BIT,
[localDevelopmentOrder] BIT,
[localDevelopmentOrderUpload] BIT,
[planningContraventionNotice] BIT,
[planningContraventionNoticeUpload] BIT,
[previousPlanningPermission] BIT,
[previousPlanningPermissionUpload] BIT;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
