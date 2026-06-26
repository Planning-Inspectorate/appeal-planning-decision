BEGIN TRY

BEGIN TRAN;

-- publish appellantCostsApplication that came from the appellant case
BEGIN TRANSACTION
UPDATE [dbo].[Document]
SET
    [published]            = 1,
    [publishedDocumentURI] = [documentUri],
    [datePublished]        = [dateCreated]
WHERE [documentType] = 'appellantCostsApplication'
AND [stage] = 'appellant-case'
COMMIT TRANSACTION

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
