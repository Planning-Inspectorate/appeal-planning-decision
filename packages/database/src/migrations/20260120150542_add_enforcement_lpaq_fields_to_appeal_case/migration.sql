BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AppealCase] ADD [affectedTrunkRoadName] NVARCHAR(1000),
[article4AffectedDevelopmentRights] NVARCHAR(1000),
[changeOfUseMineralExtraction] BIT,
[changeOfUseMineralStorage] BIT,
[changeOfUseRefuseOrWaste] BIT,
[doesAllegedBreachCreateFloorSpace] BIT,
[hasAllegedBreachArea] BIT,
[isSiteOnCrownLand] BIT,
[noticeRelatesToBuildingEngineeringMiningOther] BIT,
[relatesToBuildingSingleDwellingHouse] BIT,
[relatesToBuildingWithAgriculturalPurpose] BIT,
[relatesToErectionOfBuildingOrBuildings] BIT;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
