const documents = {
    uploadAppealStmt: 'appeal-statement-valid.pdf',
    uploadConservationMapGuidance: 'conservation-map-guidance.pdf',
    uploadPlanExtentOrder: 'plan-extent-order.pdf',
    uploadDefinitiveMapStmt: 'definitive-map-stmt.pdf',
    uploadScreeningOpinion: 'screening-openion.pdf',
    uploadEnvironmentalStmt: 'environmental-statement.pdf',
    uploadScreeningDirection: 'screening-direction.pdf',
    uploadNotifyParties: 'notify-parties.pdf',
    uploadSiteNotice: 'site-notice.pdf',
    uploadLettersEmailsToParties: 'letters-emails-to-parties.pdf',
    uploadPressAdvertisement: 'press-advertisement.pdf',
    uploadAppealNotificationLetter: 'appeal-notification-letter.pdf',
    uploadConsultationResponses: 'consultation-responses.pdf',
    uploadRepresentations: 'representations.pdf',
    uploadPoReportDecisionNotice: 'po-report-decision-notice.pdf',
    uploadPlansDrawings: 'plans-drawings.pdf',
    uploadDevelopmentPlanPolicies: 'development-plan-policies.pdf',
    uploadEmergingPlan: 'emerging-plan.pdf',
    uploadOtherPolicies: 'other-policies.pdf',
    uploadSupplementaryPlanningDocs: 'supplementary-planning-docs.pdf',
    uploadCommunityInfrastructureLevy: 'community-infrastructure-levy.pdf',
    uploadPlanningCondition: 'planning-condition.pdf',
    uploadEnforcementNotice: 'enforcement-notice.pdf',
    uploadRelatedApplication: 'related-application.pdf',
    uploadStopNotice: 'stop-notice.pdf',
    uploadEnforcementNoticePlan: 'enforcement-notice-plan.pdf',
    uploadEnforcementList: 'enforcement-list.pdf',
    uploadPlanningContraventionNotice: 'planning-contravention-notice.pdf',
    uploadLocalDevelopmentOrder: 'local-development-order.pdf'
};
export const enforcementQuestionnaireTestCases = [
    {
        constraintsAndDesignations: {
            isCorrectTypeOfAppeal: true,
            isChangesListedBuilding: false,
            isAffectListedBuildings: false,
            isScheduleMonument: false,
            isConservationArea: true,
            isProtectedSpecies: true,
            isGreenBelt: true,
            isAreaOutstandingBeauty: false,
            isAllDesignatedSite: true,
            isTreePreservationOrder: false,
            isGypsyTraveller: false,
            isPublicRightOfWay: false,
            isOtherOperations: false,
            siteAreaSquareMetres: '500',
            isAllegedBreachArea: true,
            isCreateFloorSpace: false,
            isRefuseWasteMaterials: false,
            isMineralExtractionMaterials: false,
            isStoreMinerals: false,
            isCreateBuilding: false,
            isAgriculturalPurposes: false,
            isSingleHouse: false,
            isTrunkRoad: false,
            isCrownLand: false,
            isStopNotice: false,
            isDevelopmentRights: false
                    },
            environmentalImpact: {
            isSchedule: 'no',
            isScreeningOpinion: false,
            isEnvStmt: false
                    },
            poReportAndSupportDocs: {
            ldcPlanningOfficersReport: true,
            isSelectStatuaryPlan: true,
            isOtherRelaventPolicies: true,
            isSupplementaryPlanningDocs: true,
            isCommunityInfrastructureLevy: true,
            isCommunityInfrastructureLevyAdopted: true,
            isLocalDevelopmentOrder: false,
            isPreviousPlanningPermission: false,
            isPlanningContraventionNotice: false
        },
        siteAccess: {
            isLpaSiteAccess: true,
            isNeighbourSiteAccess: false,
            isLpaSiteSafetyRisks: false
        },
        appealProcess: {
            isProcedureType: 'written',
            isOngoingAppeals: false,
            isNewConditions: true
        },
        documents,
        submit: {}
    }
];