/*
  Warnings:

  - You are about to drop the `StatementDocument` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[StatementDocument] DROP CONSTRAINT [StatementDocument_documentId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[StatementDocument] DROP CONSTRAINT [StatementDocument_statementId_fkey];

-- DropTable
DROP TABLE [dbo].[StatementDocument];

-- CreateTable
CREATE TABLE [dbo].[CommentStatementDocument] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [CommentStatementDocument_id_df] DEFAULT newid(),
    [statementId] UNIQUEIDENTIFIER,
    [commentId] UNIQUEIDENTIFIER,
    [documentId] UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT [CommentStatementDocument_pkey] PRIMARY KEY CLUSTERED ([id])
);

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

-- AddForeignKey
ALTER TABLE [dbo].[CommentStatementDocument] ADD CONSTRAINT [CommentStatementDocument_statementId_fkey] FOREIGN KEY ([statementId]) REFERENCES [dbo].[AppealStatement]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[CommentStatementDocument] ADD CONSTRAINT [CommentStatementDocument_commentId_fkey] FOREIGN KEY ([commentId]) REFERENCES [dbo].[FinalComment]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[CommentStatementDocument] ADD CONSTRAINT [CommentStatementDocument_documentId_fkey] FOREIGN KEY ([documentId]) REFERENCES [dbo].[Document]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[FinalComment] ADD CONSTRAINT [FinalComment_serviceUserId_fkey] FOREIGN KEY ([serviceUserId]) REFERENCES [dbo].[ServiceUser]([internalId]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[FinalComment] ADD CONSTRAINT [FinalComment_caseReference_fkey] FOREIGN KEY ([caseReference]) REFERENCES [dbo].[AppealCase]([caseReference]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
