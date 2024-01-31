/*
  Warnings:

  - You are about to drop the column `consultedBodiesDetails` on the `LPAQuestionnaireSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `lpaPreferInquiryDuration` on the `LPAQuestionnaireSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `lpaSiteAccessDetails` on the `LPAQuestionnaireSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `lpaSiteSafetyRiskDetails` on the `LPAQuestionnaireSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `neighbourSiteAccessDetails` on the `LPAQuestionnaireSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `newConditionDetails` on the `LPAQuestionnaireSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `sensitiveAreaDetails` on the `LPAQuestionnaireSubmission` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] DROP COLUMN [consultedBodiesDetails],
[lpaPreferInquiryDuration],
[lpaSiteAccessDetails],
[lpaSiteSafetyRiskDetails],
[neighbourSiteAccessDetails],
[newConditionDetails],
[sensitiveAreaDetails];
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] ADD [lpaProcedurePreference_lpaPreferInquiryDuration] NVARCHAR(1000),
[lpaSiteAccess_lpaSiteAccessDetails] NVARCHAR(1000),
[lpaSiteSafetyRisks_lpaSiteSafetyRiskDetails] NVARCHAR(1000),
[neighbourSiteAccess_neighbourSiteAccessDetails] NVARCHAR(1000),
[newConditions_newConditionDetails] NVARCHAR(1000),
[sensitiveArea_sensitiveAreaDetails] NVARCHAR(1000),
[statutoryConsultees_consultedBodiesDetails] NVARCHAR(1000);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
