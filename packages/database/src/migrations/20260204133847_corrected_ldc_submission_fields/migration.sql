/*
  Warnings:

  - You are about to drop the column `lpaAppealInvalidReasons` on the `LPAQuestionnaireSubmission` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] ALTER COLUMN [lpaConsiderAppealInvalid] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] DROP COLUMN [lpaAppealInvalidReasons];
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] ADD [lpaConsiderAppealInvalid_lpaAppealInvalidReasons] NVARCHAR(max);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
