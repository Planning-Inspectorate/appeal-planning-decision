BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] ADD [enforcementAgriculturalPurposes] BIT,
[enforcementAllegedBreachArea] BIT,
[enforcementCreateBuilding] BIT,
[enforcementCreateFloorSpace] BIT,
[enforcementCrownLand] BIT,
[enforcementDevelopmentRights] BIT,
[enforcementDevelopmentRightsRemoved] NVARCHAR(1000),
[enforcementDevelopmentRightsUpload] BIT,
[enforcementMineralExtractionMaterials] BIT,
[enforcementOtherOperations] BIT,
[enforcementRefuseWasteMaterials] BIT,
[enforcementSingleHouse] BIT,
[enforcementStopNotice] BIT,
[enforcementStopNoticeUpload] BIT,
[enforcementStoreMinerals] BIT,
[enforcementTrunkRoad] BIT,
[listOfPeopleSentEnforcementNotice] BIT,
[siteAreaSquareMetres] DECIMAL(32,16);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
