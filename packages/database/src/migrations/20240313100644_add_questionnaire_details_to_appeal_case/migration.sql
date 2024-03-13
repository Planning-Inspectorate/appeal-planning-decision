BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AppealCase] ADD [addAffectedListedBuilding] BIT,
[addChangedListedBuilding] BIT,
[addNearbyAppeal] BIT,
[addNeighbouringSiteAccess] BIT,
[affectedListedBuildingNumber] INT,
[affectsListedBuilding] BIT,
[areaOutstandingBeauty] BIT,
[changedListedBuildingNumber] INT,
[changesListedBuilding] BIT,
[columnTwoThreshold] BIT,
[completedEnvironmentalStatement] BIT,
[conservationArea] BIT,
[consultationResponses] BIT,
[consultedBodiesDetails] NVARCHAR(1000),
[correctAppealType] BIT,
[designatedSites] NVARCHAR(1000),
[developmentDescription] NVARCHAR(1000),
[emergingPlan] BIT,
[environmentalImpactSchedule] NVARCHAR(1000),
[greenBelt] BIT,
[gypsyTraveller] BIT,
[infrastructureLevy] BIT,
[infrastructureLevyAdopted] BIT,
[infrastructureLevyAdoptedDate] DATETIME2,
[infrastructureLevyExpectedDate] DATETIME2,
[lpaFinalComment] BIT,
[lpaFinalCommentDetails] NVARCHAR(1000),
[lpaPreferHearingDetails] NVARCHAR(1000),
[lpaPreferInquiryDetails] NVARCHAR(1000),
[lpaPreferInquiryDuration] NVARCHAR(1000),
[lpaProcedurePreference] NVARCHAR(1000),
[lpaSiteAccess] BIT,
[lpaSiteAccessDetails] NVARCHAR(1000),
[lpaSiteSafetyRiskDetails] NVARCHAR(1000),
[lpaSiteSafetyRisks] BIT,
[lpaStatement] NVARCHAR(1000),
[lpaStatementDocuments] BIT,
[lpaWitnesses] BIT,
[nearbyAppealReference] NVARCHAR(1000),
[nearbyAppeals] BIT,
[neighbouringSiteAccess] BIT,
[neighbouringSiteAccessDetails] NVARCHAR(1000),
[newConditionDetails] NVARCHAR(1000),
[newConditions] BIT,
[notificationMethod] NVARCHAR(1000),
[otherDesignationDetails] NVARCHAR(1000),
[otherPartyRepresentations] BIT,
[protectedSpecies] BIT,
[publicRightOfWay] BIT,
[requiresEnvironmentalStatement] BIT,
[scheduledMonument] BIT,
[screeningOpinion] BIT,
[sensitiveArea] BIT,
[sensitiveAreaDetails] NVARCHAR(1000),
[statutoryConsultees] BIT,
[supplementaryPlanningDocs] BIT,
[treePreservationOrder] BIT,
[uploadConservation] BIT,
[uploadConsultationResponses] BIT,
[uploadDefinitiveMapStatement] BIT,
[uploadDevelopmentPlanPolicies] BIT,
[uploadEmergingPlan] BIT,
[uploadEnvironmentalStatement] BIT,
[uploadInfrastructureLevy] BIT,
[uploadLettersEmails] BIT,
[uploadLpaProofEvidence] BIT,
[uploadLpaRebuttal] BIT,
[uploadLpaStatementDocuments] BIT,
[uploadLpaWitnessEvidence] BIT,
[uploadLpaWitnessTimings] BIT,
[uploadOtherPolicies] BIT,
[uploadPlanningOfficerReport] BIT,
[uploadPressAdvert] BIT,
[uploadRepresentations] BIT,
[uploadScreeningDirection] BIT,
[uploadScreeningOpinion] BIT,
[uploadSiteNotice] BIT,
[uploadSupplementaryPlanningDocs] BIT,
[uploadTreePreservationOrder] BIT,
[uploadWhoNotified] BIT;

-- CreateTable
CREATE TABLE [dbo].[NeighbouringAddress] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [NeighbouringAddress_id_df] DEFAULT newid(),
    [addressLine1] NVARCHAR(1000) NOT NULL,
    [addressLine2] NVARCHAR(1000),
    [townCity] NVARCHAR(1000) NOT NULL,
    [postcode] NVARCHAR(1000) NOT NULL,
    [caseReference] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [NeighbouringAddress_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[NeighbouringAddress] ADD CONSTRAINT [NeighbouringAddress_caseReference_fkey] FOREIGN KEY ([caseReference]) REFERENCES [dbo].[AppealCase]([caseReference]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
