BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Event] (
    [internalId] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [Event_internalId_df] DEFAULT newid(),
    [type] NVARCHAR(1000) NOT NULL,
    [subtype] NVARCHAR(1000),
    [name] NVARCHAR(1000),
    [status] NVARCHAR(1000),
    [isUrgent] BIT NOT NULL CONSTRAINT [Event_isUrgent_df] DEFAULT 0,
    [published] BIT NOT NULL CONSTRAINT [Event_published_df] DEFAULT 0,
    [startDate] DATETIME2,
    [endDate] DATETIME2,
    [notificationOfSiteVisit] DATETIME2,
    [caseReference] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Event_pkey] PRIMARY KEY CLUSTERED ([internalId])
);

-- AddForeignKey
ALTER TABLE [dbo].[Event] ADD CONSTRAINT [Event_caseReference_fkey] FOREIGN KEY ([caseReference]) REFERENCES [dbo].[AppealCase]([caseReference]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
