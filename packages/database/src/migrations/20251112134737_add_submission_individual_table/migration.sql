BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AppellantSubmission] ADD [enforcementOrganisationName] NVARCHAR(1000),
[enforcementWhoIsAppealing] NVARCHAR(1000);

-- CreateTable
CREATE TABLE [dbo].[SubmissionIndividual] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [SubmissionIndividual_id_df] DEFAULT newid(),
    [appellantSubmissionId] UNIQUEIDENTIFIER NOT NULL,
    [firstName] NVARCHAR(1000) NOT NULL,
    [lastName] NVARCHAR(1000) NOT NULL,
    [fieldName] NVARCHAR(1000) NOT NULL,
    [interestInAppealLand] NVARCHAR(1000),
    [interestInAppealLandDescription] NVARCHAR(1000),
    CONSTRAINT [SubmissionIndividual_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [SubmissionIndividual_appellantSubmissionId_idx] ON [dbo].[SubmissionIndividual]([appellantSubmissionId]);

-- AddForeignKey
ALTER TABLE [dbo].[SubmissionIndividual] ADD CONSTRAINT [SubmissionIndividual_appellantSubmissionId_fkey] FOREIGN KEY ([appellantSubmissionId]) REFERENCES [dbo].[AppellantSubmission]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
