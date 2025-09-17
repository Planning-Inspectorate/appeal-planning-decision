BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AppealCase] ADD [isSiteInAreaOfSpecialControlAdverts] BIT;

-- AlterTable
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] ADD [isSiteInAreaOfSpecialControlAdverts] BIT;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
