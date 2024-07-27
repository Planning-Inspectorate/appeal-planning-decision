/*
  Warnings:

  - You are about to drop the column `displaySiteNotice` on the `LPAQuestionnaireSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `lettersToNeighbours` on the `LPAQuestionnaireSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `pressAdvert` on the `LPAQuestionnaireSubmission` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] DROP COLUMN [displaySiteNotice],
[lettersToNeighbours],
[pressAdvert];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
