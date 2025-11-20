BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AppellantSubmission] ADD [contactPlanningInspectorateDate] DATETIME2,
[enforcementEffectiveDate] DATETIME2,
[enforcementIssueDate] DATETIME2,
[enforcementReferenceNumber] NVARCHAR(1000),
[hasContactedPlanningInspectorate] BIT;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
