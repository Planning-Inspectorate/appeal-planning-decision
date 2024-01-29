/*
  Warnings:

  - You are about to drop the column `appealCaseId` on the `LPAQuestionnaireSubmission` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[appealCaseReference]` on the table `LPAQuestionnaireSubmission` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `appealCaseReference` to the `LPAQuestionnaireSubmission` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] DROP CONSTRAINT [LPAQuestionnaireSubmission_appealCaseId_fkey];

-- DropIndex
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] DROP CONSTRAINT [LPAQuestionnaireSubmission_appealCaseId_key];

-- AlterTable
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] DROP COLUMN [appealCaseId];
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] ADD [appealCaseReference] NVARCHAR(1000) NOT NULL;

-- CreateIndex
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] ADD CONSTRAINT [LPAQuestionnaireSubmission_appealCaseReference_key] UNIQUE NONCLUSTERED ([appealCaseReference]);

-- AddForeignKey
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] ADD CONSTRAINT [LPAQuestionnaireSubmission_appealCaseReference_fkey] FOREIGN KEY ([appealCaseReference]) REFERENCES [dbo].[AppealCase]([caseReference]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
