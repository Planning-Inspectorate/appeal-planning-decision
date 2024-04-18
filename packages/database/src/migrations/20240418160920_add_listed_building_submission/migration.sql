BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[SubmissionListedBuilding] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [SubmissionListedBuilding_id_df] DEFAULT newid(),
    [lPAQuestionnaireSubmissionId] UNIQUEIDENTIFIER,
    [appellantSubmissionId] UNIQUEIDENTIFIER,
    [reference] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [listedBuildingGrade] NVARCHAR(1000) NOT NULL,
    [fieldName] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [SubmissionListedBuilding_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[SubmissionListedBuilding] ADD CONSTRAINT [SubmissionListedBuilding_lPAQuestionnaireSubmissionId_fkey] FOREIGN KEY ([lPAQuestionnaireSubmissionId]) REFERENCES [dbo].[LPAQuestionnaireSubmission]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[SubmissionListedBuilding] ADD CONSTRAINT [SubmissionListedBuilding_appellantSubmissionId_fkey] FOREIGN KEY ([appellantSubmissionId]) REFERENCES [dbo].[AppellantSubmission]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
