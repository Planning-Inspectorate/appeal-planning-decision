BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[InterestedPartySubmission] ADD [hasDocumentsToSupportComment] BIT,
[uploadInterestedPartyDocuments] BIT;

-- AlterTable
ALTER TABLE [dbo].[SubmissionDocumentUpload] ADD [interestedPartySubmissionId] UNIQUEIDENTIFIER;

-- CreateIndex
CREATE NONCLUSTERED INDEX [SubmissionDocumentUpload_interestedPartySubmissionId_idx] ON [dbo].[SubmissionDocumentUpload]([interestedPartySubmissionId]);

-- AddForeignKey
ALTER TABLE [dbo].[SubmissionDocumentUpload] ADD CONSTRAINT [SubmissionDocumentUpload_interestedPartySubmissionId_fkey] FOREIGN KEY ([interestedPartySubmissionId]) REFERENCES [dbo].[InterestedPartySubmission]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
