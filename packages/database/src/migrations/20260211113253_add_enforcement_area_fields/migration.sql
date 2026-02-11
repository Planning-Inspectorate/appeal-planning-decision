/*
  Warnings:

  - You are about to drop the column `doesAllegedBreachCreateFloorSpace` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `hasAllegedBreachArea` on the `AppealCase` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AppealCase] DROP COLUMN [doesAllegedBreachCreateFloorSpace],
[hasAllegedBreachArea];
ALTER TABLE [dbo].[AppealCase] ADD [areaOfAllegedBreachInSquareMetres] DECIMAL(32,16),
[floorSpaceCreatedByBreachInSquareMetres] DECIMAL(32,16);

-- AlterTable
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] ADD [allegedBreachArea_allegedBreachAreaSquareMetres] DECIMAL(32,16),
[createFloorSpace_createFloorSpaceSquareMetres] DECIMAL(32,16);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
