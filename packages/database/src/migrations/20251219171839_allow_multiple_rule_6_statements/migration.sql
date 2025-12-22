/*
  Warnings:

  - A unique constraint covering the columns `[caseReference,userId]` on the table `Rule6ProofOfEvidenceSubmission` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[caseReference,userId]` on the table `Rule6StatementSubmission` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[Rule6ProofOfEvidenceSubmission] DROP CONSTRAINT [Rule6ProofOfEvidenceSubmission_caseReference_key];

-- DropIndex
ALTER TABLE [dbo].[Rule6StatementSubmission] DROP CONSTRAINT [Rule6StatementSubmission_caseReference_key];

-- CreateIndex
ALTER TABLE [dbo].[Rule6ProofOfEvidenceSubmission] ADD CONSTRAINT [Rule6ProofOfEvidenceSubmission_caseReference_userId_key] UNIQUE NONCLUSTERED ([caseReference], [userId]);

-- CreateIndex
ALTER TABLE [dbo].[Rule6StatementSubmission] ADD CONSTRAINT [Rule6StatementSubmission_caseReference_userId_key] UNIQUE NONCLUSTERED ([caseReference], [userId]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
