/*
  Warnings:

  - You are about to drop the column `representationDocuments` on the `Representation` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Representation] DROP COLUMN [representationDocuments];

-- CreateTable
CREATE TABLE [dbo].[RepresentationDocument] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [RepresentationDocument_id_df] DEFAULT newid(),
    [representationId] UNIQUEIDENTIFIER NOT NULL,
    [documentId] UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT [RepresentationDocument_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[RepresentationDocument] ADD CONSTRAINT [RepresentationDocument_representationId_fkey] FOREIGN KEY ([representationId]) REFERENCES [dbo].[Representation]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[RepresentationDocument] ADD CONSTRAINT [RepresentationDocument_documentId_fkey] FOREIGN KEY ([documentId]) REFERENCES [dbo].[Document]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
