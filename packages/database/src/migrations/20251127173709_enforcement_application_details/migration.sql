BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AppellantSubmission] ADD [allegedBreachDescription] NVARCHAR(1000),
[applicationMadeAndFeePaid] BIT,
[applicationPartOrWholeDevelopment] NVARCHAR(1000),
[uploadApplicationReceipt] BIT;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
