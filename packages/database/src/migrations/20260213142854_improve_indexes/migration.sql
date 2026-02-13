BEGIN TRY

BEGIN TRAN;

-- DropIndex
DROP INDEX [AppealUser_email_idx] ON [dbo].[AppealUser];

-- DropIndex
DROP INDEX [Document_publishedDocumentURI_idx] ON [dbo].[Document];

-- DropIndex
DROP INDEX [LPAQuestionnaireSubmission_appealCaseReference_idx] ON [dbo].[LPAQuestionnaireSubmission];

-- DropIndex
DROP INDEX [SecurityToken_appealUserId_idx] ON [dbo].[SecurityToken];

-- CreateIndex
CREATE NONCLUSTERED INDEX [Document_documentURI_idx] ON [dbo].[Document]([documentURI]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Document_caseReference_stage_documentType_idx] ON [dbo].[Document]([caseReference], [stage], [documentType]);

-- Add custom Index
CREATE NONCLUSTERED INDEX [Document_caseRef_published_filter]
ON [dbo].[Document] (caseReference)
INCLUDE (id, publishedDocumentURI, filename, documentType, datePublished, redacted, virusCheckStatus, published)
WHERE published = 1

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
