BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[AppealStatement] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [AppealStatement_id_df] DEFAULT newid(),
    [caseReference] NVARCHAR(1000) NOT NULL,
    [serviceUserId] NVARCHAR(1000),
    [lpaCode] NVARCHAR(1000),
    [statement] NVARCHAR(1000),
    [submittedDate] DATETIME2 NOT NULL,
    CONSTRAINT [AppealStatement_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[StatementDocument] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [StatementDocument_id_df] DEFAULT newid(),
    [statementId] UNIQUEIDENTIFIER NOT NULL,
    [documentId] UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT [StatementDocument_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[AppealStatement] ADD CONSTRAINT [AppealStatement_caseReference_fkey] FOREIGN KEY ([caseReference]) REFERENCES [dbo].[AppealCase]([caseReference]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[StatementDocument] ADD CONSTRAINT [StatementDocument_statementId_fkey] FOREIGN KEY ([statementId]) REFERENCES [dbo].[AppealStatement]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[StatementDocument] ADD CONSTRAINT [StatementDocument_documentId_fkey] FOREIGN KEY ([documentId]) REFERENCES [dbo].[Document]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
