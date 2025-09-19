BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AppealCase] ADD [wasApplicationRefusedDueToHighwayOrTraffic] BIT;

-- AlterTable
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] ADD [wasApplicationRefusedDueToHighwayOrTraffic] BIT;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
