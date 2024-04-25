BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AppellantSubmission] ADD [appellantCompanyName] NVARCHAR(1000),
[appellantFirstName] NVARCHAR(1000),
[appellantLastName] NVARCHAR(1000),
[isAppellant] BIT;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
