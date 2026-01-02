BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] ALTER COLUMN [enforcementTrunkRoad] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] ADD [enforcementTrunkRoad_enforcementTrunkRoadDetails] NVARCHAR(1000);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
