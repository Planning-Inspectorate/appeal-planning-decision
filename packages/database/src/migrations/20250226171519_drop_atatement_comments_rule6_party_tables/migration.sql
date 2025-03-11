/*
  Warnings:

  - You are about to drop the `AppealStatement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FinalComment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FinalCommentDocument` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InterestedPartyComment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Rule6Party` table. If the table is not empty, all the data it contains will be lost.
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
ALTER TABLE [dbo].[Rule6Party] DROP CONSTRAINT [Rule6Party_appealUserId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Rule6Party] DROP CONSTRAINT [Rule6Party_caseReference_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[StatementDocument] DROP CONSTRAINT [StatementDocument_documentId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[StatementDocument] DROP CONSTRAINT [StatementDocument_statementId_fkey];

-- DropTable
DROP TABLE [dbo].[AppealStatement];

-- DropTable
DROP TABLE [dbo].[FinalComment];

-- DropTable
DROP TABLE [dbo].[FinalCommentDocument];

-- DropTable
DROP TABLE [dbo].[InterestedPartyComment];

-- DropTable
DROP TABLE [dbo].[Rule6Party];

-- DropTable
DROP TABLE [dbo].[StatementDocument];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
