/*
  Warnings:

  - You are about to drop the column `representationDocuments` on the `Representation` table. All the data in the column will be lost.
  - You are about to drop the `AppealStatement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FinalComment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FinalCommentDocument` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InterestedPartyComment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StatementDocument` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[AppealStatement] DROP CONSTRAINT [AppealStatement_caseReference_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[FinalComment] DROP CONSTRAINT [FinalComment_caseReference_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[FinalComment] DROP CONSTRAINT [FinalComment_serviceUserId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[FinalCommentDocument] DROP CONSTRAINT [FinalCommentDocument_commentId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[FinalCommentDocument] DROP CONSTRAINT [FinalCommentDocument_documentId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[InterestedPartyComment] DROP CONSTRAINT [InterestedPartyComment_caseReference_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[StatementDocument] DROP CONSTRAINT [StatementDocument_documentId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[StatementDocument] DROP CONSTRAINT [StatementDocument_statementId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Representation] DROP COLUMN [representationDocuments];

-- DropTable
DROP TABLE [dbo].[AppealStatement];

-- DropTable
DROP TABLE [dbo].[FinalComment];

-- DropTable
DROP TABLE [dbo].[FinalCommentDocument];

-- DropTable
DROP TABLE [dbo].[InterestedPartyComment];

-- DropTable
DROP TABLE [dbo].[StatementDocument];

-- CreateTable
CREATE TABLE [dbo].[RepresentationDocument] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [RepresentationDocument_id_df] DEFAULT newid(),
    [representationId] UNIQUEIDENTIFIER NOT NULL,
    [documentId] UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT [RepresentationDocument_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[RepresentationDocument] ADD CONSTRAINT [RepresentationDocument_representationId_fkey] FOREIGN KEY ([representationId]) REFERENCES [dbo].[Representation]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[RepresentationDocument] ADD CONSTRAINT [RepresentationDocument_documentId_fkey] FOREIGN KEY ([documentId]) REFERENCES [dbo].[Document]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
