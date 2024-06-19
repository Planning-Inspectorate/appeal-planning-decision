BEGIN TRY

BEGIN TRAN;

-- drop old index
DROP INDEX [idx_AppealUser_serviceUserId_unique_notnull] ON [dbo].[AppealUser]

-- AlterTable
ALTER TABLE [dbo].[AppealUser] ALTER COLUMN [serviceUserId] NVARCHAR(1000) NULL;

-- unique AppealUser.serviceUserId
CREATE UNIQUE NONCLUSTERED INDEX idx_AppealUser_serviceUserId_unique_notnull
ON [dbo].[AppealUser](serviceUserId)
WHERE serviceUserId IS NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
