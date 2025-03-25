BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] ALTER COLUMN [newConditions] NVARCHAR(max) NULL;
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] ALTER COLUMN [newConditions_newConditionDetails] NVARCHAR(max) NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
