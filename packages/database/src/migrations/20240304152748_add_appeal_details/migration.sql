BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AppealCase] ADD [advertisedAppeal] BIT,
[agriculturalHolding] BIT,
[appellantPreferHearingDetails] NVARCHAR(1000),
[appellantPreferInquiryDetails] NVARCHAR(1000),
[appellantProcedurePreference] NVARCHAR(1000),
[appellantSiteAccess] BIT,
[appellantSiteAccessDetails] NVARCHAR(1000),
[appellantSiteSafety] BIT,
[appellantSiteSafetyDetails] NVARCHAR(1000),
[identifiedOwners] BIT,
[informedOwners] BIT,
[informedTenantsAgriculturalHolding] BIT,
[knowsOtherOwners] BIT,
[otherTenantsAgriculturalHolding] BIT,
[ownsAllLand] BIT,
[ownsSomeLand] BIT,
[tenantAgriculturalHolding] BIT,
[yourCompanyName] NVARCHAR(1000),
[yourFirstName] NVARCHAR(1000),
[yourLastName] NVARCHAR(1000);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
