/*
  Warnings:

  - Added the required column `LPAApplicationReference` to the `AppealCase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `LPACode` to the `AppealCase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `LPAName` to the `AppealCase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `appealTypeCode` to the `AppealCase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `appealTypeName` to the `AppealCase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `costsAppliedForIndicator` to the `AppealCase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `decision` to the `AppealCase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalCaseDecisionDate` to the `AppealCase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `siteAddressLine1` to the `AppealCase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `siteAddressPostcode` to the `AppealCase` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AppealCase] ADD [LPAApplicationReference] NVARCHAR(1000) NOT NULL,
[LPACode] NVARCHAR(1000) NOT NULL,
[LPACommentsForwarded] DATETIME2,
[LPACommentsSubmitted] DATETIME2,
[LPAName] NVARCHAR(1000) NOT NULL,
[LPAProofsForwarded] DATETIME2,
[LPAProofsSubmitted] DATETIME2,
[LPAStatementForwarded] DATETIME2,
[LPAStatementSubmitted] DATETIME2,
[appealTypeCode] NVARCHAR(1000) NOT NULL,
[appealTypeName] NVARCHAR(1000) NOT NULL,
[appealValidDate] DATETIME2,
[appellantCommentsForwarded] DATETIME2,
[appellantCommentsSubmitted] DATETIME2,
[appellantStatementForwarded] DATETIME2,
[appellantStatementSubmitted] DATETIME2,
[appellantsProofsForwarded] DATETIME2,
[appellantsProofsSubmitted] DATETIME2,
[caseDecisionDate] DATETIME2,
[costsAppliedForIndicator] BIT NOT NULL,
[decision] NVARCHAR(1000) NOT NULL,
[doesAffectAScheduledMonument] BIT,
[finalCommentsDueDate] DATETIME2,
[interestedPartyRepsDueDate] DATETIME2,
[originalCaseDecisionDate] DATETIME2 NOT NULL,
[proofsOfEvidenceDueDate] DATETIME2,
[questionnaireDueDate] DATETIME2,
[questionnaireReceived] DATETIME2,
[receiptDate] DATETIME2,
[siteAddressCounty] NVARCHAR(1000),
[siteAddressLine1] NVARCHAR(1000) NOT NULL,
[siteAddressLine2] NVARCHAR(1000),
[siteAddressPostcode] NVARCHAR(1000) NOT NULL,
[siteAddressTown] NVARCHAR(1000),
[startDate] DATETIME2,
[statementDueDate] DATETIME2;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
