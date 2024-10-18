BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[FinalComment] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [FinalComment_id_df] DEFAULT newid(),
    [caseReference] NVARCHAR(1000) NOT NULL,
    [serviceUserId] UNIQUEIDENTIFIER,
    [lpaCode] NVARCHAR(1000),
    [wantsFinalComment] BIT NOT NULL,
    [comments] NVARCHAR(1000),
    [submittedDate] DATETIME2 NOT NULL,
    CONSTRAINT [FinalComment_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[FinalCommentDocument] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [FinalCommentDocument_id_df] DEFAULT newid(),
    [commentId] UNIQUEIDENTIFIER NOT NULL,
    [documentId] UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT [FinalCommentDocument_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[FinalComment] ADD CONSTRAINT [FinalComment_serviceUserId_fkey] FOREIGN KEY ([serviceUserId]) REFERENCES [dbo].[ServiceUser]([internalId]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[FinalComment] ADD CONSTRAINT [FinalComment_caseReference_fkey] FOREIGN KEY ([caseReference]) REFERENCES [dbo].[AppealCase]([caseReference]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[FinalCommentDocument] ADD CONSTRAINT [FinalCommentDocument_commentId_fkey] FOREIGN KEY ([commentId]) REFERENCES [dbo].[FinalComment]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[FinalCommentDocument] ADD CONSTRAINT [FinalCommentDocument_documentId_fkey] FOREIGN KEY ([documentId]) REFERENCES [dbo].[Document]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
