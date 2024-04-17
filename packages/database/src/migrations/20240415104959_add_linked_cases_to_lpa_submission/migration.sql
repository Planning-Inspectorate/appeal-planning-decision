/*
  Warnings:

  - You are about to drop the column `nearbyAppealReference` on the `LPAQuestionnaireSubmission` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] DROP COLUMN [nearbyAppealReference];

-- AlterTable
ALTER TABLE [dbo].[SubmissionLinkedCase] ADD [lPAQuestionnaireSubmissionId] UNIQUEIDENTIFIER;

-- AddForeignKey
ALTER TABLE [dbo].[SubmissionLinkedCase] ADD CONSTRAINT [SubmissionLinkedCase_lPAQuestionnaireSubmissionId_fkey] FOREIGN KEY ([lPAQuestionnaireSubmissionId]) REFERENCES [dbo].[LPAQuestionnaireSubmission]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
