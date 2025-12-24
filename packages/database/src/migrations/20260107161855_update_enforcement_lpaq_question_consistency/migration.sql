/*
  Warnings:

  - You are about to drop the column `enforcementAgriculturalPurposes` on the `LPAQuestionnaireSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `enforcementAllegedBreachArea` on the `LPAQuestionnaireSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `enforcementCreateBuilding` on the `LPAQuestionnaireSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `enforcementCreateFloorSpace` on the `LPAQuestionnaireSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `enforcementCrownLand` on the `LPAQuestionnaireSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `enforcementDevelopmentRights` on the `LPAQuestionnaireSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `enforcementDevelopmentRightsRemoved` on the `LPAQuestionnaireSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `enforcementDevelopmentRightsUpload` on the `LPAQuestionnaireSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `enforcementMineralExtractionMaterials` on the `LPAQuestionnaireSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `enforcementNoticeDateApplication` on the `LPAQuestionnaireSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `enforcementNoticeDateApplicationUpload` on the `LPAQuestionnaireSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `enforcementNoticePlanUpload` on the `LPAQuestionnaireSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `enforcementOtherOperations` on the `LPAQuestionnaireSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `enforcementPublicRightOfWay` on the `LPAQuestionnaireSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `enforcementRefuseWasteMaterials` on the `LPAQuestionnaireSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `enforcementSingleHouse` on the `LPAQuestionnaireSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `enforcementStopNotice` on the `LPAQuestionnaireSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `enforcementStopNoticeUpload` on the `LPAQuestionnaireSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `enforcementStoreMinerals` on the `LPAQuestionnaireSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `enforcementTrunkRoad` on the `LPAQuestionnaireSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `enforcementTrunkRoad_enforcementTrunkRoadDetails` on the `LPAQuestionnaireSubmission` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] DROP COLUMN [enforcementAgriculturalPurposes],
[enforcementAllegedBreachArea],
[enforcementCreateBuilding],
[enforcementCreateFloorSpace],
[enforcementCrownLand],
[enforcementDevelopmentRights],
[enforcementDevelopmentRightsRemoved],
[enforcementDevelopmentRightsUpload],
[enforcementMineralExtractionMaterials],
[enforcementNoticeDateApplication],
[enforcementNoticeDateApplicationUpload],
[enforcementNoticePlanUpload],
[enforcementOtherOperations],
[enforcementPublicRightOfWay],
[enforcementRefuseWasteMaterials],
[enforcementSingleHouse],
[enforcementStopNotice],
[enforcementStopNoticeUpload],
[enforcementStoreMinerals],
[enforcementTrunkRoad],
[enforcementTrunkRoad_enforcementTrunkRoadDetails];
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] ADD [agriculturalPurposes] BIT,
[allegedBreachArea] BIT,
[createBuilding] BIT,
[createFloorSpace] BIT,
[crownLand] BIT,
[developmentRights] BIT,
[developmentRightsRemoved] NVARCHAR(1000),
[developmentRightsUpload] BIT,
[mineralExtractionMaterials] BIT,
[noticeDateApplication] BIT,
[noticeDateApplicationUpload] BIT,
[noticePlanUpload] BIT,
[otherOperations] BIT,
[refuseWasteMaterials] BIT,
[singleHouse] BIT,
[stopNotice] BIT,
[stopNoticeUpload] BIT,
[storeMinerals] BIT,
[trunkRoad] NVARCHAR(1000),
[trunkRoad_trunkRoadDetails] NVARCHAR(1000);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
