/*
  Warnings:

  - You are about to drop the column `upploadInfrastructureLevy` on the `LPAQuestionnaireSubmission` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] DROP COLUMN [upploadInfrastructureLevy];
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] ADD [uploadInfrastructureLevy] BIT;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
