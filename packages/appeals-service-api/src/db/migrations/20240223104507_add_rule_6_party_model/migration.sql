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
    [proofEvidenceSubmitted] BIT NOT NULL,
    [proofEvidenceSubmittedDate] DATETIME2,
    [proofEvidenceReceived] BIT NOT NULL,
    [proofEvidenceReceivedDate] DATETIME2,
    [proofEvidenceValidationOutcome] NVARCHAR(1000),
    [proofEvidenceValidationOutcomeDate] DATETIME2,
    [proofEvidenceValidationDetails] NVARCHAR(1000),
    [statementDocuments] BIT NOT NULL,
    [witnesses] BIT NOT NULL,
    [statementSubmitted] BIT NOT NULL,
    [statementSubmittedDate] DATETIME2,
    [statementReceived] BIT NOT NULL,
    [statementReceivedDate] DATETIME2,
    [statementValidationOutcome] NVARCHAR(1000),
    [statementValidationOutcomeDate] DATETIME2,
    [statementValidationDetails] NVARCHAR(1000),
    [appealUserId] UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT [Rule6Party_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Rule6Party] ADD CONSTRAINT [Rule6Party_appealUserId_fkey] FOREIGN KEY ([appealUserId]) REFERENCES [dbo].[AppealUser]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Rule6Party] ADD CONSTRAINT [Rule6Party_caseReference_fkey] FOREIGN KEY ([caseReference]) REFERENCES [dbo].[AppealCase]([caseReference]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
