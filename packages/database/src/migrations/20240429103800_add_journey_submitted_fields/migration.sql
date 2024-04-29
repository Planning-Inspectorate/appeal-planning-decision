/*
  Warnings:

  - You are about to drop the column `submittedToBackOffice` on the `AppellantSubmission` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AppellantSubmission] DROP COLUMN [submittedToBackOffice];
ALTER TABLE [dbo].[AppellantSubmission] ADD [submitted] BIT NOT NULL CONSTRAINT [AppellantSubmission_submitted_df] DEFAULT 0;

-- AlterTable
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] ADD [submitted] BIT NOT NULL CONSTRAINT [LPAQuestionnaireSubmission_submitted_df] DEFAULT 0;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
