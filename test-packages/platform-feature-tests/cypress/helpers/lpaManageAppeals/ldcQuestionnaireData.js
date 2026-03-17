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
    uploadRelatedApplication: 'related-application.pdf'
};
export const ldcQuestionnaireTestCases = [
    {
        constraintsAndDesignations: {
            isCorrectTypeOfAppeal: true,
            isChangesListedBuilding: true,
            isAffectListedBuildings: true,
            isAffectedListedBuildings: true,
            isScheduledMonuments: true,
            isConservationArea: true,
            isProtectedSpecies: true,
            isSpecialControl: true,
            isGreenBelt: true,
            isNationalLandscape: true,
            isAllDesignatedSite: true,
            // LDC-specific fields for section 1
            ldcTypeOfCertificate: 'existingDevelopment',
            ldcPlanningCondition: true,
            ldcEnforcementNotice: true,
            ldcRelatedApplications: true,
            ldcAppealInvalid: true
        },
        notifyParties: {
            // ...existing code...
        },
        consultResponseAndRepresent: {
            isStatutoryConsultees: true,
            isOtherPartyRepresentations: true,
        },
        poReportAndSupportDocs: {
            isHighway: true,
            isPhotographsPlans: true,
            isStatutoryPlan: true,
            isEmergingPlan: true,
            isRelevantPolcies: true,
            isSupplementaryPlanningDocs: true,
            // LDC-specific fields for section 2
            ldcPlanningOfficersReport: true,
            isCommunityInfrastructureLevy: true,
            isCommunityInfrastructureLevyAdopted: true,
            //ldcCommunityInfrastructureLevy: true,
            ldcOtherRelevantMatters: true
        },
        siteAccess: {
            isLpaSiteAccess: true,
            isNeighbourSiteAccess: true,
            isLpaSiteSafetyRisks: true,
            // LDC-specific fields for section 3
            ldcSiteAccess: true,
            ldcNeighbourSiteAccess: true,
            ldcPotentialSafetyRisks: false
        },
        appealProcess: {
            isProcedureType: 'written',
            isOngoingAppeals: false,
            isNearbyAppeals: false,
            isNewConditions: true,
            // LDC-specific fields for section 4
            ldcProcedureType: true,
            ldcWhyInquiry: false
        },
        documents,
        submit: {}
    },
    {
        constraintsAndDesignations: {
            isCorrectTypeOfAppeal: false,
            isChangesListedBuilding: false,
            isAffectListedBuildings: false,
            isAffectedListedBuildings: false,
            isScheduledMonuments: false,
            isConservationArea: false,
            isProtectedSpecies: true,
            isSpecialControl: true,
            isGreenBelt: true,
            isNationalLandscape: true,
            isAllDesignatedSite: true,
        },

        notifyParties: {

        },
        consultResponseAndRepresent: {
            isStatutoryConsultees: true,
            isOtherPartyRepresentations: true,
        },
        poReportAndSupportDocs: {
            isHighway: true,
            isPhotographsPlans: true,
            isStatutoryPlan: true,
            isEmergingPlan: false,
            isRelevantPolcies: true,
            isSupplementaryPlanningDocs: true,
        },
        siteAccess: {
            isLpaSiteAccess: true,
            isNeighbourSiteAccess: false,
            isLpaSiteSafetyRisks: true,
        },
        appealProcess: {
            isProcedureType: 'written',
            isOngoingAppeals: false,
            isNearbyAppeals: false,
            isNewConditions: true,
        },
        documents,
        submit: {}
    },

    {
        constraintsAndDesignations: {
            isCorrectTypeOfAppeal: true,
            isChangesListedBuilding: false,
            isAffectListedBuildings: false,
            isAffectedListedBuildings: false,
            isScheduledMonuments: false,
            isConservationArea: false,
            isProtectedSpecies: false,
            isSpecialControl: false,
            isGreenBelt: false,
            isNationalLandscape: false,
            isAllDesignatedSite: false,
        },
        notifyParties: {

        },
        consultResponseAndRepresent: {
            isStatutoryConsultees: true,
            isOtherPartyRepresentations: true,
        },
        poReportAndSupportDocs: {
            isHighway: true,
            isPhotographsPlans: true,
            isStatutoryPlan: true,
            isEmergingPlan: true,
            isRelevantPolcies: true,
            isSupplementaryPlanningDocs: true,
        },
        siteAccess: {
            isLpaSiteAccess: true,
            isNeighbourSiteAccess: false,
            isLpaSiteSafetyRisks: true,
        },
        appealProcess: {
            isProcedureType: 'written',
            isOngoingAppeals: true,
            isNearbyAppeals: true,
            isNewConditions: false,
        },
        documents,
        submit: {}
    }
];