BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[InterestedPartyComment] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [InterestedPartyComment_id_df] DEFAULT newid(),
    [caseReference] NVARCHAR(1000) NOT NULL,
    [serviceUserId] NVARCHAR(1000),
    [comment] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [InterestedPartyComment_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [InterestedPartyComment_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[InterestedPartyComment] ADD CONSTRAINT [InterestedPartyComment_caseReference_fkey] FOREIGN KEY ([caseReference]) REFERENCES [dbo].[AppealCase]([caseReference]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
