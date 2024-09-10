BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[SubmissionDocumentUpload] ADD [appellantFinalCommentId] UNIQUEIDENTIFIER,
[lpaFinalCommentId] UNIQUEIDENTIFIER;

-- CreateTable
CREATE TABLE [dbo].[LPAFinalCommentSubmission] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [LPAFinalCommentSubmission_id_df] DEFAULT newid(),
    [caseReference] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [LPAFinalCommentSubmission_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2,
    [submitted] BIT NOT NULL CONSTRAINT [LPAFinalCommentSubmission_submitted_df] DEFAULT 0,
    [lpaFinalComment] BIT,
    [lpaFinalCommentDetails] NVARCHAR(1000),
    [lpaFinalCommentDocuments] BIT,
    [uploadLPAFinalCommentDocuments] BIT,
    CONSTRAINT [LPAFinalCommentSubmission_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [LPAFinalCommentSubmission_caseReference_key] UNIQUE NONCLUSTERED ([caseReference])
);

-- CreateTable
CREATE TABLE [dbo].[AppellantFinalCommentSubmission] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [AppellantFinalCommentSubmission_id_df] DEFAULT newid(),
    [caseReference] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [AppellantFinalCommentSubmission_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2,
    [submitted] BIT NOT NULL CONSTRAINT [AppellantFinalCommentSubmission_submitted_df] DEFAULT 0,
    [appellantFinalComment] BIT,
    [appellantFinalCommentDetails] NVARCHAR(1000),
    [appellantFinalCommentDocuments] BIT,
    [uploadAppellantFinalCommentDocuments] BIT,
    CONSTRAINT [AppellantFinalCommentSubmission_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [AppellantFinalCommentSubmission_caseReference_key] UNIQUE NONCLUSTERED ([caseReference])
);

-- AddForeignKey
ALTER TABLE [dbo].[LPAFinalCommentSubmission] ADD CONSTRAINT [LPAFinalCommentSubmission_caseReference_fkey] FOREIGN KEY ([caseReference]) REFERENCES [dbo].[AppealCase]([caseReference]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AppellantFinalCommentSubmission] ADD CONSTRAINT [AppellantFinalCommentSubmission_caseReference_fkey] FOREIGN KEY ([caseReference]) REFERENCES [dbo].[AppealCase]([caseReference]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[SubmissionDocumentUpload] ADD CONSTRAINT [SubmissionDocumentUpload_appellantFinalCommentId_fkey] FOREIGN KEY ([appellantFinalCommentId]) REFERENCES [dbo].[AppellantFinalCommentSubmission]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[SubmissionDocumentUpload] ADD CONSTRAINT [SubmissionDocumentUpload_lpaFinalCommentId_fkey] FOREIGN KEY ([lpaFinalCommentId]) REFERENCES [dbo].[LPAFinalCommentSubmission]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
