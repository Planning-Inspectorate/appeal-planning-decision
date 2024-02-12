BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[LPAQuestionnaireSubmission] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [LPAQuestionnaireSubmission_id_df] DEFAULT newid(),
    [appealCaseReference] NVARCHAR(1000) NOT NULL,
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
    [lpaSiteAccess] NVARCHAR(1000),
    [lpaSiteAccess_lpaSiteAccessDetails] NVARCHAR(1000),
    [neighbourSiteAccess] NVARCHAR(1000),
    [neighbourSiteAccess_neighbourSiteAccessDetails] NVARCHAR(1000),
    [addNeighbourSiteAccess] BIT,
    [neighbourSiteAddress] BIT,
    [lpaSiteSafetyRisks] NVARCHAR(1000),
    [lpaSiteSafetyRisks_lpaSiteSafetyRiskDetails] NVARCHAR(1000),
    [lpaProcedurePreference] NVARCHAR(1000),
    [lpaPreferHearingDetails] NVARCHAR(1000),
    [lpaProcedurePreference_lpaPreferInquiryDuration] NVARCHAR(1000),
    [lpaPreferInquiryDetails] NVARCHAR(1000),
    [nearbyAppeals] BIT,
    [nearbyAppealReference] NVARCHAR(1000),
    [addNearbyAppeal] BIT,
    [newConditions] NVARCHAR(1000),
    [newConditions_newConditionDetails] NVARCHAR(1000),
    [emergingPlan] BIT,
    [uploadEmergingPlan] BIT,
    [uploadDevelopmentPlanPolicies] BIT,
    [uploadOtherPolicies] BIT,
    [infrastructureLevy] BIT,
    [uploadInfrastructureLevy] BIT,
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
    [statutoryConsultees] NVARCHAR(1000),
    [statutoryConsultees_consultedBodiesDetails] NVARCHAR(1000),
    [protectedSpecies] BIT,
    [publicRightOfWay] BIT,
    [areaOutstandingBeauty] BIT,
    [designatedSites] NVARCHAR(1000),
    [designatedSites_otherDesignations] NVARCHAR(1000),
    [screeningOpinion] BIT,
    [environmentalStatement] BIT,
    [environmentalImpactSchedule] NVARCHAR(1000),
    [uploadEnvironmentalStatement] BIT,
    [columnTwoThreshold] BIT,
    [sensitiveArea] NVARCHAR(1000),
    [sensitiveArea_sensitiveAreaDetails] NVARCHAR(1000),
    [uploadScreeningOpinion] BIT,
    [uploadScreeningDirection] BIT,
    [developmentDescription] NVARCHAR(1000),
    [requiresEnvironmentalStatement] NVARCHAR(1000),
    CONSTRAINT [LPAQuestionnaireSubmission_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [LPAQuestionnaireSubmission_appealCaseReference_key] UNIQUE NONCLUSTERED ([appealCaseReference])
);

-- CreateTable
CREATE TABLE [dbo].[SubmissionDocumentUpload] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [SubmissionDocumentUpload_id_df] DEFAULT newid(),
    [questionnaireId] UNIQUEIDENTIFIER NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [fileName] NVARCHAR(1000) NOT NULL,
    [originalFileName] NVARCHAR(1000) NOT NULL,
    [location] NVARCHAR(1000) NOT NULL,
    [type] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [SubmissionDocumentUpload_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[SubmissionNeighbourAddress] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [SubmissionNeighbourAddress_id_df] DEFAULT newid(),
    [questionnaireId] UNIQUEIDENTIFIER NOT NULL,
    [addressLine1] NVARCHAR(1000) NOT NULL,
    [addressLine2] NVARCHAR(1000),
    [townCity] NVARCHAR(1000) NOT NULL,
    [postcode] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [SubmissionNeighbourAddress_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[LPAQuestionnaireSubmission] ADD CONSTRAINT [LPAQuestionnaireSubmission_appealCaseReference_fkey] FOREIGN KEY ([appealCaseReference]) REFERENCES [dbo].[AppealCase]([caseReference]) ON DELETE NO ACTION ON UPDATE CASCADE;

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
