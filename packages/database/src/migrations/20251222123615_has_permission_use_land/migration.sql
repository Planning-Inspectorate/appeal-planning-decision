/*
  Warnings:

  - You are about to drop the column `interestInAppealLandDetails` on the `AppellantSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `interestInAppealLandDescription` on the `SubmissionIndividual` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AppellantSubmission] DROP COLUMN [interestInAppealLandDetails];
ALTER TABLE [dbo].[AppellantSubmission] ADD [hasPermissionToUseLand] BIT,
[interestInAppealLand_interestInAppealLandDetails] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[SubmissionIndividual] DROP COLUMN [interestInAppealLandDescription];
ALTER TABLE [dbo].[SubmissionIndividual] ADD [hasPermissionToUseLand] BIT,
[interestInAppealLand_interestInAppealLandDetails] NVARCHAR(1000);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
