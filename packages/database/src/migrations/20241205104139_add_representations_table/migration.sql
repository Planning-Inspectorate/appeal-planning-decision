BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Representation] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [Representation_id_df] DEFAULT newid(),
    [representationId] NVARCHAR(1000) NOT NULL,
    [caseId] INT,
    [caseReference] NVARCHAR(1000) NOT NULL,
    [status] NVARCHAR(1000),
    [originalRepresentation] NVARCHAR(1000),
    [redacted] BIT,
    [redactedRepresentation] NVARCHAR(1000),
    [redactedBy] NVARCHAR(1000),
    [invalidDetails] NVARCHAR(1000),
    [source] NVARCHAR(1000),
    [serviceUserId] NVARCHAR(1000),
    [representationType] NVARCHAR(1000),
    [dateReceived] DATETIME2,
    [representationDocuments] NVARCHAR(max),
    CONSTRAINT [Representation_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Representation_caseReference_key] UNIQUE NONCLUSTERED ([caseReference])
);

-- AddForeignKey
ALTER TABLE [dbo].[Representation] ADD CONSTRAINT [Representation_caseReference_fkey] FOREIGN KEY ([caseReference]) REFERENCES [dbo].[AppealCase]([caseReference]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
