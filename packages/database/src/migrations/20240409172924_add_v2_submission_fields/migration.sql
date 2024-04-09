/*
  Warnings:

  - You are about to alter the column `ownsAllLand` on the `AppellantSubmission` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(1000)` to `Bit`.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[SubmissionAddress] DROP CONSTRAINT [SubmissionAddress_questionnaireId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[SubmissionDocumentUpload] DROP CONSTRAINT [SubmissionDocumentUpload_questionnaireId_fkey];

-- AlterTable
ALTER TABLE [dbo].[AppellantSubmission] ALTER COLUMN [ownsAllLand] BIT NULL;
ALTER TABLE [dbo].[AppellantSubmission] ADD [advertisedAppeal] BIT,
[appellantGreenBelt] BIT,
[appellantLinkedCase] BIT,
[appellantLinkedCaseAdd] BIT,
[appellantLinkedCaseReference] NVARCHAR(1000),
[appellantPhoneNumber] NVARCHAR(1000),
[appellantSiteAccess] NVARCHAR(1000),
[appellantSiteAccess_appellantSiteAccessDetails] NVARCHAR(1000),
[appellantSiteSafety] NVARCHAR(1000),
[appellantSiteSafety_appellantSiteSafetyDetails] NVARCHAR(1000),
[applicationReference] NVARCHAR(1000),
[caseTermsAccepted] BIT,
[costApplication] BIT,
[developmentDescriptionOriginal] NVARCHAR(1000),
[identifiedOwners] BIT,
[informedOwners] BIT,
[knowsAllOwners] BIT,
[knowsOtherOwners] BIT,
[onApplicationDate] DATETIME2,
[ownsSomeLand] BIT,
[siteAddress] BIT,
[siteAreaSquareMetres] INT,
[submittedToBackOffice] BIT,
[updateDevelopmentDescription] BIT,
[uploadAppellantStatement] BIT,
[uploadApplicationDecisionLetter] BIT,
[uploadCostApplication] BIT,
[uploadOriginalApplicationForm] BIT;

-- AlterTable
ALTER TABLE [dbo].[SubmissionAddress] ALTER COLUMN [questionnaireId] UNIQUEIDENTIFIER NULL;
ALTER TABLE [dbo].[SubmissionAddress] ADD [appellantSubmissionId] UNIQUEIDENTIFIER;

-- AlterTable
ALTER TABLE [dbo].[SubmissionDocumentUpload] ALTER COLUMN [questionnaireId] UNIQUEIDENTIFIER NULL;
ALTER TABLE [dbo].[SubmissionDocumentUpload] ADD [appellantSubmissionId] UNIQUEIDENTIFIER;

-- CreateTable
CREATE TABLE [dbo].[SubmissionLinkedCase] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [SubmissionLinkedCase_id_df] DEFAULT newid(),
    [appellantSubmissionId] UNIQUEIDENTIFIER,
    [caseReference] NVARCHAR(1000) NOT NULL,
    [fieldName] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [SubmissionLinkedCase_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[SubmissionDocumentUpload] ADD CONSTRAINT [SubmissionDocumentUpload_questionnaireId_fkey] FOREIGN KEY ([questionnaireId]) REFERENCES [dbo].[LPAQuestionnaireSubmission]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[SubmissionDocumentUpload] ADD CONSTRAINT [SubmissionDocumentUpload_appellantSubmissionId_fkey] FOREIGN KEY ([appellantSubmissionId]) REFERENCES [dbo].[AppellantSubmission]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[SubmissionAddress] ADD CONSTRAINT [SubmissionAddress_questionnaireId_fkey] FOREIGN KEY ([questionnaireId]) REFERENCES [dbo].[LPAQuestionnaireSubmission]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[SubmissionAddress] ADD CONSTRAINT [SubmissionAddress_appellantSubmissionId_fkey] FOREIGN KEY ([appellantSubmissionId]) REFERENCES [dbo].[AppellantSubmission]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[SubmissionLinkedCase] ADD CONSTRAINT [SubmissionLinkedCase_appellantSubmissionId_fkey] FOREIGN KEY ([appellantSubmissionId]) REFERENCES [dbo].[AppellantSubmission]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
