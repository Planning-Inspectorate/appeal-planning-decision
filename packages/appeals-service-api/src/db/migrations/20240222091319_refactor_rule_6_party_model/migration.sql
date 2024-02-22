/*
  Warnings:

  - Added the required column `appealUserId` to the `Rule6Party` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rule6ProofsEvidenceReceived` to the `Rule6Party` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Rule6Party] ADD [appealUserId] UNIQUEIDENTIFIER NOT NULL,
[rule6ProofsEvidenceReceived] BIT NOT NULL;

-- AddForeignKey
ALTER TABLE [dbo].[Rule6Party] ADD CONSTRAINT [Rule6Party_appealUserId_fkey] FOREIGN KEY ([appealUserId]) REFERENCES [dbo].[AppealUser]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
