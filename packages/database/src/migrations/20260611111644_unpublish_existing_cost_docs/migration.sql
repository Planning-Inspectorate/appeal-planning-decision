BEGIN TRY

BEGIN TRAN;

-- Unpublish costs docs
UPDATE [dbo].[Document]
SET
    [published]            = 0,
    [publishedDocumentURI] = NULL,
    [datePublished]        = NULL
WHERE [documentType] IN (
    'appellantCostsApplication',
    'appellantCostsCorrespondence',
    'appellantCostsWithdrawal',
    'lpaCostsApplication',
    'lpaCostsCorrespondence',
    'lpaCostsWithdrawal'
)

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
