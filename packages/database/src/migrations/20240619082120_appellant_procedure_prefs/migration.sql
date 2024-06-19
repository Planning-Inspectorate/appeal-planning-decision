BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AppellantSubmission] ADD [appellantPreferHearingDetails] NVARCHAR(1000),
[appellantPreferInquiryDetails] NVARCHAR(1000),
[appellantPreferInquiryDuration] INT,
[appellantPreferInquiryWitnesses] INT;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
