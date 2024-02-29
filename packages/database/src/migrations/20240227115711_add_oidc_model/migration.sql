BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Oidc] (
    [id] NVARCHAR(1000) NOT NULL,
    [type] INT NOT NULL,
    [payload] NVARCHAR(max) NOT NULL,
    [grantId] NVARCHAR(1000),
    [userCode] NVARCHAR(1000),
    [uid] NVARCHAR(1000),
    [expiresAt] DATETIME2,
    [consumedAt] DATETIME2,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Oidc_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Oidc_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Oidc_id_type_key] UNIQUE NONCLUSTERED ([id],[type])
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
