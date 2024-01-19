BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[LPAQuestionnaireSubmission] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [LPAQuestionnaireSubmission_id_df] DEFAULT newid(),
    [appealCaseId] UNIQUEIDENTIFIER NOT NULL,
    [correctAppealType] BIT,
    [affectsListedBuilding] BIT,
    [affectedListedBuildingNumber] NVARCHAR(1000),
    [addAffectedListedBuilding] BIT,
    [changesListedBuilding] BIT,
    [changedListedBuildingNumber] NVARCHAR(1000),
    [addChangedListedBuilding] BIT,
    [conservationArea] BIT,
    [uploadConservation] BIT,
    [greenBelt] BIT,
    [uploadWhoNotified] BIT,
    [displaySiteNotice] BIT,
    [lettersToNeighbours] BIT,
    [uploadLettersEmails] BIT,
    [pressAdvert] BIT,
    [uploadPressAdvert] BIT,
    [consultationResponses] BIT,
    [uploadConsultationResponses] BIT,
    [notificationMethod] NVARCHAR(1000),
    [uploadSiteNotice] BIT,
    [otherPartyRepresentations] BIT,
    [uploadRepresentations] BIT,
    [uploadPlanningOfficerReport] BIT,
    [lpaSiteAccess] BIT,
    [lpaSiteAccessDetails] NVARCHAR(1000),
    [neighbourSiteAccess] BIT,
    [neighbourSiteAccessDetails] NVARCHAR(1000),
    [addNeighbourSiteAccess] BIT,
    [neighbourSiteAddress] BIT,
    [lpaSiteSafetyRisks] BIT,
    [lpaSiteSafetyRiskDetails] NVARCHAR(1000),
    [lpaProcedurePreference] NVARCHAR(1000),
    [lpaPreferHearingDetails] NVARCHAR(1000),
    [lpaPreferInquiryDuration] NVARCHAR(1000),
    [lpaPreferInquiryDetails] NVARCHAR(1000),
    [nearbyAppeals] BIT,
    [nearbyAppealReference] NVARCHAR(1000),
    [addNearbyAppeal] BIT,
    [newConditions] BIT,
    [newConditionDetails] NVARCHAR(1000),
    [emergingPlan] BIT,
    [uploadEmergingPlan] BIT,
    [uploadDevelopmentPlanPolicies] BIT,
    [uploadOtherPolicies] BIT,
    [infrastructureLevy] BIT,
    [upploadInfrastructureLevy] BIT,
    [infrastructureLevyAdopted] BIT,
    [infrastructureLevyAdoptedDate] DATETIME2,
    [infrastructureLevyExpectedDate] DATETIME2,
    [uploadLettersInterestedParties] BIT,
    [treePreservationOrder] BIT,
    [uploadTreePreservationOrder] BIT,
    [uploadDefinitiveMapStatement] BIT,
    [supplementaryPlanningDocs] BIT,
    [uploadSupplementaryPlanningDocs] BIT,
    [affectsScheduledMonument] BIT,
    [gypsyTraveller] BIT,
    [statutoryConsultees] BIT,
    [consultedBodiesDetails] NVARCHAR(1000),
    [protectedSpecies] BIT,
    [publicRightOfWay] BIT,
    [areaOutstandingBeauty] BIT,
    [designatedSites] NVARCHAR(1000),
    [otherDesignations] NVARCHAR(1000),
    [screeningOpinion] BIT,
    [environmentalStatement] BIT,
    [environmentalImpactSchedule] NVARCHAR(1000),
    [uploadEnvironmentalStatement] BIT,
    [columnTwoThreshold] BIT,
    [sensitiveArea] BIT,
    [sensitiveAreaDetails] NVARCHAR(1000),
    [uploadScreeningOpinion] BIT,
    [uploadScreeningDirection] BIT,
    [developmentDescription] NVARCHAR(1000),
    [requiresEnvironmentalStatement] BIT,
    CONSTRAINT [LPAQuestionnaireSubmission_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [LPAQuestionnaireSubmission_appealCaseId_key] UNIQUE NONCLUSTERED ([appealCaseId])
);

-- CreateTable
CREATE TABLE [dbo].[SubmissionDocumentUpload] (
    [questionnaireId] UNIQUEIDENTIFIER NOT NULL,
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [SubmissionDocumentUpload_id_df] DEFAULT newid(),
    [name] NVARCHAR(1000) NOT NULL CONSTRAINT [SubmissionDocumentUpload_name_df] DEFAULT '',
    [fileName] NVARCHAR(1000) NOT NULL CONSTRAINT [SubmissionDocumentUpload_fileName_df] DEFAULT '',
    [originalFileName] NVARCHAR(1000) NOT NULL CONSTRAINT [SubmissionDocumentUpload_originalFileName_df] DEFAULT '',
    [location] NVARCHAR(1000) NOT NULL CONSTRAINT [SubmissionDocumentUpload_location_df] DEFAULT '',
    [type] NVARCHAR(1000) NOT NULL CONSTRAINT [SubmissionDocumentUpload_type_df] DEFAULT '',
    CONSTRAINT [SubmissionDocumentUpload_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[SubmissionNeighbourAddress] (
    [questionnaireId] UNIQUEIDENTIFIER NOT NULL,
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [SubmissionNeighbourAddress_id_df] DEFAULT newid(),
    [addressLine1] NVARCHAR(1000) NOT NULL CONSTRAINT [SubmissionNeighbourAddress_addressLine1_df] DEFAULT '',
    [addressLine2] NVARCHAR(1000),
    [townCity] NVARCHAR(1000) NOT NULL CONSTRAINT [SubmissionNeighbourAddress_townCity_df] DEFAULT '',
    [postcode] NVARCHAR(1000) NOT NULL CONSTRAINT [SubmissionNeighbourAddress_postcode_df] DEFAULT '',
    CONSTRAINT [SubmissionNeighbourAddress_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] ADD CONSTRAINT [LPAQuestionnaireSubmission_appealCaseId_fkey] FOREIGN KEY ([appealCaseId]) REFERENCES [dbo].[AppealCase]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[SubmissionDocumentUpload] ADD CONSTRAINT [SubmissionDocumentUpload_questionnaireId_fkey] FOREIGN KEY ([questionnaireId]) REFERENCES [dbo].[LPAQuestionnaireSubmission]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[SubmissionNeighbourAddress] ADD CONSTRAINT [SubmissionNeighbourAddress_questionnaireId_fkey] FOREIGN KEY ([questionnaireId]) REFERENCES [dbo].[LPAQuestionnaireSubmission]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
