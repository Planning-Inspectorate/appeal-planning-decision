BEGIN TRY

BEGIN TRAN;

-- DropIndex
DROP INDEX [Document_caseReference_idx] ON [dbo].[Document];

-- DropIndex
DROP INDEX [Document_caseReference_stage_documentType_idx] ON [dbo].[Document];

-- CreateIndex
CREATE NONCLUSTERED INDEX [Document_caseReference_published_idx] ON [dbo].[Document]([caseReference], [published]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Document_caseReference_stage_published_idx] ON [dbo].[Document]([caseReference], [stage], [published]);

-- Manual index
CREATE NONCLUSTERED INDEX [Document_caseRef_type_idx]
ON [dbo].[Document] ([caseReference], [documentType])
INCLUDE (id, publishedDocumentURI, filename, datePublished, redacted, virusCheckStatus, published)

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
