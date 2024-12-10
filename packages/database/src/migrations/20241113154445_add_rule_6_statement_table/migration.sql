BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[SubmissionDocumentUpload] DROP CONSTRAINT [SubmissionDocumentUpload_rule6ProofOfEvidenceSubmissionId_fkey];

-- AlterTable
ALTER TABLE [dbo].[AppealCase] ADD [rule6StatementSubmittedDate] DATETIME2;

-- AlterTable
ALTER TABLE [dbo].[SubmissionDocumentUpload] ADD [rule6StatementSubmissionId] UNIQUEIDENTIFIER;

-- CreateTable
CREATE TABLE [dbo].[Rule6StatementSubmission] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [Rule6StatementSubmission_id_df] DEFAULT newid(),
    [caseReference] NVARCHAR(1000) NOT NULL,
    [userId] UNIQUEIDENTIFIER NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Rule6StatementSubmission_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2,
    [submitted] BIT NOT NULL CONSTRAINT [Rule6StatementSubmission_submitted_df] DEFAULT 0,
    [rule6Statement] NVARCHAR(1000),
    [rule6AdditionalDocuments] BIT,
    [uploadRule6StatementDocuments] BIT,
    CONSTRAINT [Rule6StatementSubmission_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Rule6StatementSubmission_caseReference_key] UNIQUE NONCLUSTERED ([caseReference])
);

-- AddForeignKey
ALTER TABLE [dbo].[Rule6StatementSubmission] ADD CONSTRAINT [Rule6StatementSubmission_caseReference_fkey] FOREIGN KEY ([caseReference]) REFERENCES [dbo].[AppealCase]([caseReference]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Rule6StatementSubmission] ADD CONSTRAINT [Rule6StatementSubmission_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[AppealUser]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[SubmissionDocumentUpload] ADD CONSTRAINT [SubmissionDocumentUpload_rule6ProofOfEvidenceSubmissionId_fkey] FOREIGN KEY ([rule6ProofOfEvidenceSubmissionId]) REFERENCES [dbo].[Rule6ProofOfEvidenceSubmission]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[SubmissionDocumentUpload] ADD CONSTRAINT [SubmissionDocumentUpload_rule6StatementSubmissionId_fkey] FOREIGN KEY ([rule6StatementSubmissionId]) REFERENCES [dbo].[Rule6StatementSubmission]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
