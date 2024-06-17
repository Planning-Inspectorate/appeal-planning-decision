BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[ServiceUser] ADD [addressCountry] NVARCHAR(1000),
[addressCounty] NVARCHAR(1000),
[addressLine1] NVARCHAR(1000),
[addressLine2] NVARCHAR(1000),
[addressTown] NVARCHAR(1000),
[faxNumber] NVARCHAR(1000),
[organisation] NVARCHAR(1000),
[organisationType] NVARCHAR(1000),
[otherPhoneNumber] NVARCHAR(1000),
[postcode] NVARCHAR(1000),
[role] NVARCHAR(1000),
[sourceSuid] NVARCHAR(1000),
[sourceSystem] NVARCHAR(1000),
[telephoneNumber] NVARCHAR(1000),
[webAddress] NVARCHAR(1000);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
