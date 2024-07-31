BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[InterestedPartySubmission] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [InterestedPartySubmission_id_df] DEFAULT newid(),
    [caseReference] NVARCHAR(1000) NOT NULL,
    [firstName] NVARCHAR(1000) NOT NULL,
    [lastName] NVARCHAR(1000) NOT NULL,
    [addressLine1] NVARCHAR(1000),
    [addressLine2] NVARCHAR(1000),
    [townCity] NVARCHAR(1000),
    [county] NVARCHAR(1000),
    [postcode] NVARCHAR(1000),
    [emailAddress] NVARCHAR(1000),
    [comments] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [InterestedPartySubmission_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [InterestedPartySubmission_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[InterestedPartySubmission] ADD CONSTRAINT [InterestedPartySubmission_caseReference_fkey] FOREIGN KEY ([caseReference]) REFERENCES [dbo].[AppealCase]([caseReference]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
