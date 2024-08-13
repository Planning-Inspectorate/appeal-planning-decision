BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[SubmissionDocumentUpload] ADD [lpaStatementId] UNIQUEIDENTIFIER;

-- CreateTable
CREATE TABLE [dbo].[LPAStatementSubmission] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [LPAStatementSubmission_id_df] DEFAULT newid(),
    [appealCaseReference] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [LPAStatementSubmission_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2,
    [submitted] BIT NOT NULL CONSTRAINT [LPAStatementSubmission_submitted_df] DEFAULT 0,
    [lpaStatement] NVARCHAR(1000),
    [additionalDocuments] BIT NOT NULL CONSTRAINT [LPAStatementSubmission_additionalDocuments_df] DEFAULT 0,
    CONSTRAINT [LPAStatementSubmission_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [LPAStatementSubmission_appealCaseReference_key] UNIQUE NONCLUSTERED ([appealCaseReference])
);

-- AddForeignKey
ALTER TABLE [dbo].[LPAStatementSubmission] ADD CONSTRAINT [LPAStatementSubmission_appealCaseReference_fkey] FOREIGN KEY ([appealCaseReference]) REFERENCES [dbo].[AppealCase]([caseReference]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[SubmissionDocumentUpload] ADD CONSTRAINT [SubmissionDocumentUpload_lpaStatementId_fkey] FOREIGN KEY ([lpaStatementId]) REFERENCES [dbo].[LPAStatementSubmission]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
