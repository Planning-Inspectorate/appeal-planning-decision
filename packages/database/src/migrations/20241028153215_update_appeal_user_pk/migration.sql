/*
  Warnings:

  - The primary key for the `AppealToUser` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AppealToUser] DROP CONSTRAINT [AppealToUser_pkey];
ALTER TABLE [dbo].[AppealToUser] ADD [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [AppealToUser_id_df] DEFAULT newid();
ALTER TABLE [dbo].[AppealToUser] ADD CONSTRAINT AppealToUser_pkey PRIMARY KEY CLUSTERED ([id]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
