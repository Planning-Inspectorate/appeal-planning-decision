BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[SubmissionDocumentUpload] ADD [rule6ProofOfEvidenceSubmissionId] UNIQUEIDENTIFIER;

-- CreateTable
CREATE TABLE [dbo].[Rule6ProofOfEvidenceSubmission] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [Rule6ProofOfEvidenceSubmission_id_df] DEFAULT newid(),
    [caseReference] NVARCHAR(1000) NOT NULL,
    [userId] UNIQUEIDENTIFIER NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Rule6ProofOfEvidenceSubmission_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2,
    [submitted] BIT NOT NULL CONSTRAINT [Rule6ProofOfEvidenceSubmission_submitted_df] DEFAULT 0,
    [uploadRule6ProofOfEvidenceDocuments] BIT,
    [rule6Witnesses] BIT,
    [uploadRule6WitnessesEvidence] BIT,
    CONSTRAINT [Rule6ProofOfEvidenceSubmission_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Rule6ProofOfEvidenceSubmission_caseReference_key] UNIQUE NONCLUSTERED ([caseReference])
);

-- AddForeignKey
ALTER TABLE [dbo].[Rule6ProofOfEvidenceSubmission] ADD CONSTRAINT [Rule6ProofOfEvidenceSubmission_caseReference_fkey] FOREIGN KEY ([caseReference]) REFERENCES [dbo].[AppealCase]([caseReference]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Rule6ProofOfEvidenceSubmission] ADD CONSTRAINT [Rule6ProofOfEvidenceSubmission_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[AppealUser]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[SubmissionDocumentUpload] ADD CONSTRAINT [SubmissionDocumentUpload_rule6ProofOfEvidenceSubmissionId_fkey] FOREIGN KEY ([rule6ProofOfEvidenceSubmissionId]) REFERENCES [dbo].[Rule6ProofOfEvidenceSubmission]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
