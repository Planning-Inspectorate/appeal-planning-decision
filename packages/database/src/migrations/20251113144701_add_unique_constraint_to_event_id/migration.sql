/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Event` will be added. If there are existing duplicate values, this will fail.
  - Made the column `id` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
BEGIN TRY

BEGIN TRAN;

-- Delete null seed records
DELETE FROM [dbo].[Event] WHERE [id] IS NULL;

-- AlterTable
ALTER TABLE [dbo].[Event] ALTER COLUMN [id] NVARCHAR(1000) NOT NULL;

-- CreateIndex
ALTER TABLE [dbo].[Event] ADD CONSTRAINT [Event_id_key] UNIQUE NONCLUSTERED ([id]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
