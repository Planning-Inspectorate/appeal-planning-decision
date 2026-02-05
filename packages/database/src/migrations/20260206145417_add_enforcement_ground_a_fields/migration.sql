BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AppealCase] ADD [groundAFeePaid] BIT,
[retrospectiveApplication] BIT;

-- AlterTable
ALTER TABLE [dbo].[AppellantSubmission] ADD [groundAFeePaid] BIT,
[retrospectiveApplication] BIT,
[uploadGroundAFeeReceipt] BIT;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
