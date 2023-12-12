BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[ServiceUser] (
    [internalId] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [ServiceUser_internalId_df] DEFAULT newid(),
    [id] NVARCHAR(1000) NOT NULL,
    [salutation] NVARCHAR(1000),
    [firstName] NVARCHAR(1000),
    [lastName] NVARCHAR(1000),
    [emailAddress] NVARCHAR(1000),
    [serviceUserType] NVARCHAR(1000) NOT NULL,
    [caseReference] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [ServiceUser_pkey] PRIMARY KEY CLUSTERED ([internalId])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
