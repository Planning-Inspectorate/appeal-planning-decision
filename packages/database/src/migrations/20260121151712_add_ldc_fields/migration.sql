BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AppealCase] ADD [appealUnderActSection] NVARCHAR(1000),
[applicationMadeUnderActSection] NVARCHAR(1000),
[lpaAppealInvalidReasons] NVARCHAR(max),
[lpaConsiderAppealInvalid] BIT,
[siteUseAtTimeOfApplication] NVARCHAR(1000);

-- AlterTable
EXEC sp_rename 'AppellantSubmission.existingUse', 'siteUseAtTimeOfApplication', 'COLUMN';
EXEC sp_rename 'AppellantSubmission.lawfulDevelopmentCertificateType', 'applicationMadeUnderActSection', 'COLUMN';

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
