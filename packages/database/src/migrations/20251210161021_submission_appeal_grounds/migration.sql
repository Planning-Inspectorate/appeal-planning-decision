BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AppellantSubmission] ADD [appealGrounds] NVARCHAR(1000);

-- CreateTable
CREATE TABLE [dbo].[SubmissionAppealGround] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [SubmissionAppealGround_id_df] DEFAULT newid(),
    [appellantSubmissionId] UNIQUEIDENTIFIER NOT NULL,
    [groundName] NVARCHAR(1000) NOT NULL,
    [facts] NVARCHAR(1000),
    [addSupportingDocuments] BIT,
    CONSTRAINT [SubmissionAppealGround_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [SubmissionAppealGround_appellantSubmissionId_idx] ON [dbo].[SubmissionAppealGround]([appellantSubmissionId]);

-- AddForeignKey
ALTER TABLE [dbo].[SubmissionAppealGround] ADD CONSTRAINT [SubmissionAppealGround_appellantSubmissionId_fkey] FOREIGN KEY ([appellantSubmissionId]) REFERENCES [dbo].[AppellantSubmission]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
