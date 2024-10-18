BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[SubmissionDocumentUpload] ADD [appellantProofOfEvidenceId] UNIQUEIDENTIFIER;

-- CreateTable
CREATE TABLE [dbo].[AppellantProofOfEvidenceSubmission] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [AppellantProofOfEvidenceSubmission_id_df] DEFAULT newid(),
    [caseReference] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [AppellantProofOfEvidenceSubmission_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2,
    [submitted] BIT NOT NULL CONSTRAINT [AppellantProofOfEvidenceSubmission_submitted_df] DEFAULT 0,
    [uploadAppellantProofOfEvidenceDocuments] BIT,
    [appellantWitnesses] BIT,
    [uploadAppellantWitnessesEvidence] BIT,
    CONSTRAINT [AppellantProofOfEvidenceSubmission_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [AppellantProofOfEvidenceSubmission_caseReference_key] UNIQUE NONCLUSTERED ([caseReference])
);

-- AddForeignKey
ALTER TABLE [dbo].[AppellantProofOfEvidenceSubmission] ADD CONSTRAINT [AppellantProofOfEvidenceSubmission_caseReference_fkey] FOREIGN KEY ([caseReference]) REFERENCES [dbo].[AppealCase]([caseReference]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[SubmissionDocumentUpload] ADD CONSTRAINT [SubmissionDocumentUpload_appellantProofOfEvidenceId_fkey] FOREIGN KEY ([appellantProofOfEvidenceId]) REFERENCES [dbo].[AppellantProofOfEvidenceSubmission]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
