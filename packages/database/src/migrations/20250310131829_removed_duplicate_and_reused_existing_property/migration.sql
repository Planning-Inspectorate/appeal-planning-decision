/*
  Warnings:

  - You are about to drop the column `preserveGrantLoan` on the `LPAQuestionnaireSubmission` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] DROP COLUMN [preserveGrantLoan];
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] ADD [section3aGrant] BIT;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
