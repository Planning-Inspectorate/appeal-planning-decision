BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Document] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [Document_id_df] DEFAULT newid(),
    [filename] NVARCHAR(1000) NOT NULL,
    [originalFilename] NVARCHAR(1000) NOT NULL,
    [size] INT NOT NULL,
    [mime] NVARCHAR(1000) NOT NULL,
    [documentURI] NVARCHAR(1000) NOT NULL,
    [dateCreated] DATETIME2 NOT NULL,
    [dateReceived] DATETIME2,
    [lastModified] DATETIME2,
    [virusCheckStatus] NVARCHAR(1000),
    [published] BIT NOT NULL CONSTRAINT [Document_published_df] DEFAULT 0,
    [redacted] BIT NOT NULL CONSTRAINT [Document_redacted_df] DEFAULT 0,
    [documentType] NVARCHAR(1000) NOT NULL,
    [sourceSystem] NVARCHAR(1000) NOT NULL,
    [origin] NVARCHAR(1000) NOT NULL,
    [stage] NVARCHAR(1000) NOT NULL,
    [caseReference] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Document_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Document] ADD CONSTRAINT [Document_caseReference_fkey] FOREIGN KEY ([caseReference]) REFERENCES [dbo].[AppealCase]([caseReference]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
