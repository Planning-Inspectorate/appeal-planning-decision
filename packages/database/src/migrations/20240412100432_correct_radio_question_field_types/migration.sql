BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AppellantSubmission] ALTER COLUMN [knowsAllOwners] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[AppellantSubmission] ALTER COLUMN [knowsOtherOwners] NVARCHAR(1000) NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH