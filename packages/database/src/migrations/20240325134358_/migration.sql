BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[AppellantSubmission] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [AppellantSubmission_id_df] DEFAULT newid(),
    [LPACode] NVARCHAR(1000) NOT NULL,
    [appealTypeCode] NVARCHAR(1000) NOT NULL,
    [appealId] UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT [AppellantSubmission_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [AppellantSubmission_appealId_key] UNIQUE NONCLUSTERED ([appealId])
);

-- AddForeignKey
ALTER TABLE [dbo].[AppellantSubmission] ADD CONSTRAINT [AppellantSubmission_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
