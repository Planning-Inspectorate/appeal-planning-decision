BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AppealCase] ADD [applicationMadeAndFeePaid] BIT,
[applicationPartOrWholeDevelopment] NVARCHAR(1000),
[contactPlanningInspectorateDate] DATETIME2,
[dateLpaDecisionDue] DATETIME2,
[dateLpaDecisionReceived] DATETIME2,
[descriptionOfAllegedBreach] NVARCHAR(1000),
[didAppellantAppealLpaDecision] BIT,
[effectiveDateOfEnforcementNotice] DATETIME2,
[enforcementReference] NVARCHAR(1000),
[issueDateOfEnforcementNotice] DATETIME2,
[occupancyConditionsMet] BIT,
[ownerOccupancyStatus] NVARCHAR(1000),
[previousPlanningPermissionGranted] BIT;

-- CreateTable
CREATE TABLE [dbo].[EnforcementAppealGroundsDetails] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [EnforcementAppealGroundsDetails_id_df] DEFAULT newid(),
    [appealGroundLetter] NVARCHAR(1000),
    [groundForAppealStartDate] DATETIME2,
    [groundFacts] NVARCHAR(1000),
    [caseReference] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [EnforcementAppealGroundsDetails_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [EnforcementAppealGroundsDetails_caseReference_idx] ON [dbo].[EnforcementAppealGroundsDetails]([caseReference]);

-- AddForeignKey
ALTER TABLE [dbo].[EnforcementAppealGroundsDetails] ADD CONSTRAINT [EnforcementAppealGroundsDetails_caseReference_fkey] FOREIGN KEY ([caseReference]) REFERENCES [dbo].[AppealCase]([caseReference]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
