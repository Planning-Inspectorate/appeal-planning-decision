BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[SubmissionDocumentUpload] ADD [appellantStatementId] UNIQUEIDENTIFIER;

-- CreateTable
CREATE TABLE [dbo].[AppellantStatementSubmission] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [AppellantStatementSubmission_id_df] DEFAULT newid(),
    [appealCaseReference] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [AppellantStatementSubmission_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2,
    [submitted] BIT NOT NULL CONSTRAINT [AppellantStatementSubmission_submitted_df] DEFAULT 0,
    [appellantStatement] NVARCHAR(max),
    [additionalDocuments] BIT,
    [uploadAppellantStatementDocuments] BIT,
    CONSTRAINT [AppellantStatementSubmission_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [AppellantStatementSubmission_appealCaseReference_key] UNIQUE NONCLUSTERED ([appealCaseReference])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [AppellantStatementSubmission_appealCaseReference_idx] ON [dbo].[AppellantStatementSubmission]([appealCaseReference]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [SubmissionDocumentUpload_appellantStatementId_idx] ON [dbo].[SubmissionDocumentUpload]([appellantStatementId]);

-- AddForeignKey
ALTER TABLE [dbo].[AppellantStatementSubmission] ADD CONSTRAINT [AppellantStatementSubmission_appealCaseReference_fkey] FOREIGN KEY ([appealCaseReference]) REFERENCES [dbo].[AppealCase]([caseReference]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[SubmissionDocumentUpload] ADD CONSTRAINT [SubmissionDocumentUpload_appellantStatementId_fkey] FOREIGN KEY ([appellantStatementId]) REFERENCES [dbo].[AppellantStatementSubmission]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
