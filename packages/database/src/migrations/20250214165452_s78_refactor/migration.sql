/*
  Warnings:

  - You are about to drop the column `LPACommentsForwarded` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `LPACommentsSubmitted` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `LPAProofsForwarded` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `LPAProofsSubmitted` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `LPAStatementForwarded` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `LPAStatementSubmitted` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `addNeighbouringSiteAccess` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `appellantCommentsForwarded` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `appellantCommentsSubmitted` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `appellantFinalCommentDetails` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `appellantFinalCommentsSubmitted` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `appellantProofEvidencePublished` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `appellantStatementForwarded` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `appellantStatementSubmitted` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `appellantsProofsForwarded` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `appellantsProofsSubmitted` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `conservationArea` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `consultationResponses` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `designatedSites` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `emergingPlan` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `interestedPartyCommentsPublished` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `lpaFinalComment` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `lpaFinalCommentDetails` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `lpaFinalCommentsPublished` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `lpaPreferHearingDetails` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `lpaPreferInquiryDetails` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `lpaPreferInquiryDuration` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `lpaProofEvidencePublished` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `lpaProofEvidenceSubmitted` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `lpaSiteAccess` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `lpaSiteAccessDetails` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `lpaSiteSafetyRiskDetails` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `lpaSiteSafetyRisks` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `lpaStatementDocuments` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `lpaStatementPublished` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `lpaWitnesses` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `neighbouringSiteAccess` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `neighbouringSiteAccessDetails` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `otherDesignationDetails` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `otherPartyRepresentations` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `planningObligation` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `rule6ProofEvidenceDueDate` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `rule6ProofEvidenceSubmitted` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `rule6ProofEvidenceSubmittedDate` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `rule6ProofsEvidencePublished` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `rule6StatementDueDate` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `rule6StatementPublished` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `rule6StatementSubmitted` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `rule6StatementSubmittedDate` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `sensitiveArea` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `supplementaryPlanningDocs` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `treePreservationOrder` on the `AppealCase` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AppealCase] DROP CONSTRAINT [AppealCase_scheduledMonument_df];
ALTER TABLE [dbo].[AppealCase] DROP CONSTRAINT [AppealCase_appellantFinalCommentsSubmitted_df];
ALTER TABLE [dbo].[AppealCase] DROP CONSTRAINT [AppealCase_appellantProofEvidencePublished_df];
ALTER TABLE [dbo].[AppealCase] DROP CONSTRAINT [AppealCase_interestedPartyCommentsPublished_df];
ALTER TABLE [dbo].[AppealCase] DROP CONSTRAINT [AppealCase_lpaFinalCommentsPublished_df];
ALTER TABLE [dbo].[AppealCase] DROP CONSTRAINT [AppealCase_lpaProofEvidencePublished_df];
ALTER TABLE [dbo].[AppealCase] DROP CONSTRAINT [AppealCase_lpaProofEvidenceSubmitted_df];
ALTER TABLE [dbo].[AppealCase] DROP CONSTRAINT [AppealCase_lpaStatementPublished_df];
ALTER TABLE [dbo].[AppealCase] DROP CONSTRAINT [AppealCase_rule6ProofEvidenceSubmitted_df];
ALTER TABLE [dbo].[AppealCase] DROP CONSTRAINT [AppealCase_rule6ProofsEvidencePublished_df];
ALTER TABLE [dbo].[AppealCase] DROP CONSTRAINT [AppealCase_rule6StatementPublished_df];
ALTER TABLE [dbo].[AppealCase] DROP CONSTRAINT [AppealCase_rule6StatementSubmitted_df];
ALTER TABLE [dbo].[AppealCase] ALTER COLUMN [scheduledMonument] BIT NULL;
ALTER TABLE [dbo].[AppealCase] DROP COLUMN [LPACommentsForwarded],
[LPACommentsSubmitted],
[LPAProofsForwarded],
[LPAProofsSubmitted],
[LPAStatementForwarded],
[LPAStatementSubmitted],
[addNeighbouringSiteAccess],
[appellantCommentsForwarded],
[appellantCommentsSubmitted],
[appellantFinalCommentDetails],
[appellantFinalCommentsSubmitted],
[appellantProofEvidencePublished],
[appellantStatementForwarded],
[appellantStatementSubmitted],
[appellantsProofsForwarded],
[appellantsProofsSubmitted],
[conservationArea],
[consultationResponses],
[designatedSites],
[emergingPlan],
[interestedPartyCommentsPublished],
[lpaFinalComment],
[lpaFinalCommentDetails],
[lpaFinalCommentsPublished],
[lpaPreferHearingDetails],
[lpaPreferInquiryDetails],
[lpaPreferInquiryDuration],
[lpaProofEvidencePublished],
[lpaProofEvidenceSubmitted],
[lpaSiteAccess],
[lpaSiteAccessDetails],
[lpaSiteSafetyRiskDetails],
[lpaSiteSafetyRisks],
[lpaStatementDocuments],
[lpaStatementPublished],
[lpaWitnesses],
[neighbouringSiteAccess],
[neighbouringSiteAccessDetails],
[otherDesignationDetails],
[otherPartyRepresentations],
[planningObligation],
[rule6ProofEvidenceDueDate],
[rule6ProofEvidenceSubmitted],
[rule6ProofEvidenceSubmittedDate],
[rule6ProofsEvidencePublished],
[rule6StatementDueDate],
[rule6StatementPublished],
[rule6StatementSubmitted],
[rule6StatementSubmittedDate],
[sensitiveArea],
[supplementaryPlanningDocs],
[treePreservationOrder];
ALTER TABLE [dbo].[AppealCase] ADD [LPACommentsSubmittedDate] DATETIME2,
[LPAProofsSubmittedDate] DATETIME2,
[LPAStatementSubmittedDate] DATETIME2,
[appellantCommentsSubmittedDate] DATETIME2,
[appellantProcedurePreferenceWitnessCount] INT,
[appellantProofsSubmittedDate] DATETIME2,
[appellantStatementSubmittedDate] DATETIME2,
[caseworkReason] NVARCHAR(1000),
[dateCostsReportDespatched] DATETIME2,
[dateNotRecoveredOrDerecovered] DATETIME2,
[dateRecovered] DATETIME2,
[designatedSitesNames] NVARCHAR(max),
[developmentType] NVARCHAR(1000),
[importantInformation] NVARCHAR(1000),
[jurisdiction] NVARCHAR(1000),
[numberOfResidencesNetChange] INT,
[originalCaseDecisionDate] DATETIME2,
[reasonForNeighbourVisits] NVARCHAR(1000),
[redeterminedIndicator] NVARCHAR(1000),
[siteGridReferenceEasting] NVARCHAR(1000),
[siteGridReferenceNorthing] NVARCHAR(1000),
[siteNoticesSentDate] DATETIME2,
[siteViewableFromRoad] BIT,
[siteWithinSSSI] BIT,
[targetDate] DATETIME2,
[typeOfPlanningApplication] NVARCHAR(1000);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
