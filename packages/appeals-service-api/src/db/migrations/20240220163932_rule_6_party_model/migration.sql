BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Rule6Party] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [Rule6Party_id_df] DEFAULT newid(),
    [caseReference] NVARCHAR(1000) NOT NULL,
    [firstName] NVARCHAR(1000) NOT NULL,
    [lastName] NVARCHAR(1000) NOT NULL,
    [over18] BIT NOT NULL,
    [partyName] NVARCHAR(1000) NOT NULL,
    [partyEmail] NVARCHAR(1000) NOT NULL,
    [addressLine1] NVARCHAR(1000) NOT NULL,
    [addressLine2] NVARCHAR(1000),
    [addressTown] NVARCHAR(1000),
    [addressCounty] NVARCHAR(1000),
    [addressPostcode] NVARCHAR(1000),
    [partyStatus] NVARCHAR(1000) NOT NULL,
    [statement] NVARCHAR(1000) NOT NULL,
    [statementDocuments] BIT NOT NULL,
    [witnesses] BIT NOT NULL,
    [statementSubmitted] BIT NOT NULL,
    [statementSubmittedDate] DATETIME2,
    [statementReceived] BIT NOT NULL,
    [statementReceivedDate] DATETIME2,
    [statementValidationOutcome] NVARCHAR(1000),
    [statementValidationOutcomeDate] DATETIME2,
    [statementValidationDetails] NVARCHAR(1000),
    [appealCaseReference] NVARCHAR(1000),
    CONSTRAINT [Rule6Party_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Rule6Party_appealCaseReference_key] UNIQUE NONCLUSTERED ([appealCaseReference])
);

-- AddForeignKey
ALTER TABLE [dbo].[Rule6Party] ADD CONSTRAINT [Rule6Party_appealCaseReference_fkey] FOREIGN KEY ([appealCaseReference]) REFERENCES [dbo].[AppealCase]([caseReference]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
