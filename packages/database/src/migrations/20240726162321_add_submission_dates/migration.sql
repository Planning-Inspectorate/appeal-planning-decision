BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AppellantSubmission] ADD [createdAt] DATETIME2 NOT NULL CONSTRAINT [AppellantSubmission_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
[updatedAt] DATETIME2;

-- AlterTable
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] ADD [createdAt] DATETIME2 NOT NULL CONSTRAINT [LPAQuestionnaireSubmission_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
[updatedAt] DATETIME2;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
