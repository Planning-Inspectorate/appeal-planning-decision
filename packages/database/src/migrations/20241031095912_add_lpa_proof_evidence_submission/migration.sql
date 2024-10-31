BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[SubmissionDocumentUpload] ADD [lpaProofOfEvidenceId] UNIQUEIDENTIFIER;

-- CreateTable
CREATE TABLE [dbo].[LPAProofOfEvidenceSubmission] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [LPAProofOfEvidenceSubmission_id_df] DEFAULT newid(),
    [caseReference] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [LPAProofOfEvidenceSubmission_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2,
    [submitted] BIT NOT NULL CONSTRAINT [LPAProofOfEvidenceSubmission_submitted_df] DEFAULT 0,
    [uploadLpaProofOfEvidenceDocuments] BIT,
    [lpaWitnesses] BIT,
    [uploadLpaWitnessesEvidence] BIT,
    CONSTRAINT [LPAProofOfEvidenceSubmission_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [LPAProofOfEvidenceSubmission_caseReference_key] UNIQUE NONCLUSTERED ([caseReference])
);

-- AddForeignKey
ALTER TABLE [dbo].[LPAProofOfEvidenceSubmission] ADD CONSTRAINT [LPAProofOfEvidenceSubmission_caseReference_fkey] FOREIGN KEY ([caseReference]) REFERENCES [dbo].[AppealCase]([caseReference]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[SubmissionDocumentUpload] ADD CONSTRAINT [SubmissionDocumentUpload_lpaProofOfEvidenceId_fkey] FOREIGN KEY ([lpaProofOfEvidenceId]) REFERENCES [dbo].[LPAProofOfEvidenceSubmission]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
