BEGIN TRY

BEGIN TRAN;

-- Rename Column
EXEC sp_rename 'LPAQuestionnaireSubmission.requiresEnvironmentalStatement', 'applicantSubmittedEnvironmentalStatement', 'COLUMN';

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
