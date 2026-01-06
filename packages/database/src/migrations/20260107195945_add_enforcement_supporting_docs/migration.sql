BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AppellantSubmission] ADD [uploadGroundASupporting] BIT,
[uploadGroundBSupporting] BIT,
[uploadGroundCSupporting] BIT,
[uploadGroundDSupporting] BIT,
[uploadGroundESupporting] BIT,
[uploadGroundFSupporting] BIT,
[uploadGroundGSupporting] BIT,
[uploadGroundHSupporting] BIT,
[uploadGroundISupporting] BIT,
[uploadGroundJSupporting] BIT,
[uploadGroundKSupporting] BIT;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
