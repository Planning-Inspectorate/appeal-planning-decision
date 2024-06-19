BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AppellantSubmission] ADD [agriculturalHolding] BIT,
[designAccessStatement] BIT,
[informedTenantsAgriculturalHolding] BIT,
[newPlansDrawings] BIT,
[otherNewDocuments] BIT,
[otherTenantsAgriculturalHolding] BIT,
[ownershipCertificate] BIT,
[planningObligation] BIT,
[siteArea] DECIMAL(32,16),
[statusPlanningObligation] NVARCHAR(1000),
[uploadDesignAccessStatement] BIT,
[uploadNewPlansDrawings] BIT,
[uploadOtherNewDocuments] BIT,
[uploadOwnershipCertificate] BIT,
[uploadPlanningObligation] BIT,
[uploadPlansDrawings] BIT,
[uploadStatementCommonGround] BIT;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
