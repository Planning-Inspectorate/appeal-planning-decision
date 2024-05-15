BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AppealCase] ADD [appellantGreenBelt] BIT,
[appellantLinkedCase] BIT,
[appellantPhoneNumber] NVARCHAR(1000),
[isAppellant] BIT,
[onApplicationDate] DATETIME2,
[siteAreaSquareMetres] DECIMAL(32,16);

-- AlterTable
ALTER TABLE [dbo].[SubmissionLinkedCase] ADD [appealCaseId] UNIQUEIDENTIFIER;

-- AddForeignKey
ALTER TABLE [dbo].[SubmissionLinkedCase] ADD CONSTRAINT [SubmissionLinkedCase_appealCaseId_fkey] FOREIGN KEY ([appealCaseId]) REFERENCES [dbo].[AppealCase]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
