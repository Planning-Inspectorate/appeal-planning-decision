/*
  Warnings:

  - You are about to drop the `SubmissionNeighbourAddress` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `storageId` to the `SubmissionDocumentUpload` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[SubmissionNeighbourAddress] DROP CONSTRAINT [SubmissionNeighbourAddress_questionnaireId_fkey];

-- AlterTable
ALTER TABLE [dbo].[SubmissionDocumentUpload] ADD [storageId] NVARCHAR(1000) NOT NULL;

-- DropTable
DROP TABLE [dbo].[SubmissionNeighbourAddress];

-- CreateTable
CREATE TABLE [dbo].[SubmissionAddress] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [SubmissionAddress_id_df] DEFAULT newid(),
    [questionnaireId] UNIQUEIDENTIFIER NOT NULL,
    [addressLine1] NVARCHAR(1000) NOT NULL,
    [addressLine2] NVARCHAR(1000),
    [townCity] NVARCHAR(1000) NOT NULL,
    [postcode] NVARCHAR(1000) NOT NULL,
    [fieldName] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [SubmissionAddress_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[SubmissionAddress] ADD CONSTRAINT [SubmissionAddress_questionnaireId_fkey] FOREIGN KEY ([questionnaireId]) REFERENCES [dbo].[LPAQuestionnaireSubmission]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
