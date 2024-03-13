BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AppealCase] ADD [developmentDescriptionDetails] NVARCHAR(1000),
[statusPlanningObligation] NVARCHAR(1000),
[updateDevelopmentDescription] BIT;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
