/*
  Warnings:

  - You are about to drop the column `didYouDoTheEnvironmentalStatement` on the `LPAQuestionnaireSubmission` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] DROP COLUMN [didYouDoTheEnvironmentalStatement];
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] ADD [appellantSubmittedEnvironmentalStatement] NVARCHAR(1000);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
