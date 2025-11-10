/*
  Warnings:

  - You are about to drop the column `isAdvertInPosition` on the `AppealCase` table. All the data in the column will be lost.
  - You are about to drop the column `isSiteOnHighwayLand` on the `AppealCase` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AppealCase] DROP COLUMN [isAdvertInPosition],
[isSiteOnHighwayLand];

-- CreateTable
CREATE TABLE [dbo].[AdvertDetails] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [AdvertDetails_id_df] DEFAULT newid(),
    [advertType] NVARCHAR(1000),
    [isAdvertInPosition] BIT NOT NULL,
    [isSiteOnHighwayLand] BIT NOT NULL,
    [caseReference] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [AdvertDetails_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [AdvertDetails_caseReference_idx] ON [dbo].[AdvertDetails]([caseReference]);

-- AddForeignKey
ALTER TABLE [dbo].[AdvertDetails] ADD CONSTRAINT [AdvertDetails_caseReference_fkey] FOREIGN KEY ([caseReference]) REFERENCES [dbo].[AppealCase]([caseReference]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
