BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[AppealUser] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [AppealUser_id_df] DEFAULT newid(),
    [email] NVARCHAR(1000) NOT NULL,
    [isEnrolled] BIT NOT NULL CONSTRAINT [AppealUser_isEnrolled_df] DEFAULT 0,
    [serviceUserId] INT,
    [isLpaUser] BIT NOT NULL CONSTRAINT [AppealUser_isLpaUser_df] DEFAULT 0,
    [lpaCode] NVARCHAR(1000),
    [isLpaAdmin] BIT,
    [lpaStatus] NVARCHAR(1000),
    CONSTRAINT [AppealUser_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [AppealUser_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[SecurityToken] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [SecurityToken_id_df] DEFAULT newid(),
    [appealUserId] UNIQUEIDENTIFIER NOT NULL,
    [token] NVARCHAR(1000) NOT NULL,
    [tokenGeneratedAt] DATETIME2 NOT NULL,
    [attempts] INT NOT NULL CONSTRAINT [SecurityToken_attempts_df] DEFAULT 0,
    [action] NVARCHAR(1000),
    CONSTRAINT [SecurityToken_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [SecurityToken_appealUserId_key] UNIQUE NONCLUSTERED ([appealUserId])
);

-- CreateTable
CREATE TABLE [dbo].[Appeal] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [Appeal_id_df] DEFAULT newid(),
    [legacyAppealSubmissionId] NVARCHAR(1000),
    [legacyAppealSubmissionDecisionDate] DATETIME2,
    [legacyAppealSubmissionState] NVARCHAR(1000),
    CONSTRAINT [Appeal_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[AppealToUser] (
    [appealId] UNIQUEIDENTIFIER NOT NULL,
    [userId] UNIQUEIDENTIFIER NOT NULL,
    [role] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [AppealToUser_pkey] PRIMARY KEY CLUSTERED ([appealId],[userId])
);

-- CreateTable
CREATE TABLE [dbo].[AppealToUserRole] (
    [name] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    CONSTRAINT [AppealToUserRole_pkey] PRIMARY KEY CLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[AppealCase] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [AppealCase_id_df] DEFAULT newid(),
    [caseReference] NVARCHAR(1000) NOT NULL,
    [appealId] UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT [AppealCase_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [AppealCase_caseReference_key] UNIQUE NONCLUSTERED ([caseReference]),
    CONSTRAINT [AppealCase_appealId_key] UNIQUE NONCLUSTERED ([appealId])
);

-- AddForeignKey
ALTER TABLE [dbo].[SecurityToken] ADD CONSTRAINT [SecurityToken_appealUserId_fkey] FOREIGN KEY ([appealUserId]) REFERENCES [dbo].[AppealUser]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AppealToUser] ADD CONSTRAINT [AppealToUser_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AppealToUser] ADD CONSTRAINT [AppealToUser_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[AppealUser]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AppealToUser] ADD CONSTRAINT [AppealToUser_role_fkey] FOREIGN KEY ([role]) REFERENCES [dbo].[AppealToUserRole]([name]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AppealCase] ADD CONSTRAINT [AppealCase_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- unique AppealUser.serviceUserId
CREATE UNIQUE NONCLUSTERED INDEX idx_AppealUser_serviceUserId_unique_notnull
ON [dbo].[AppealUser](serviceUserId)
WHERE serviceUserId IS NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
