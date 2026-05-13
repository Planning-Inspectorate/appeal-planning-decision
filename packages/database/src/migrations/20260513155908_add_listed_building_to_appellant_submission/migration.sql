BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AppellantSubmission] ADD [isListedBuilding] BIT;

COMMIT TRAN;

EXEC sp_executesql N'
UPDATE [dbo].[AppellantSubmission]
SET [isListedBuilding] = 0
WHERE [appealTypeCode] = ''LDC''
  AND [applicationDecision] IS NULL;

UPDATE [dbo].[AppellantSubmission]
SET [isListedBuilding] = 1
WHERE [appealTypeCode] = ''LDC''
  AND [applicationDecision] IS NOT NULL;


UPDATE [dbo].[AppellantSubmission]
SET [isListedBuilding] = 0
WHERE [appealTypeCode] = ''ENFORCEMENT'';

UPDATE [dbo].[AppellantSubmission]
SET [isListedBuilding] = 1
WHERE [appealTypeCode] = ''ENFORCEMENT_LISTED'';
';

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
