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
    uploadConsultationResponses: 'consultation-responses.pdf',
    uploadRepresentations: 'representations.pdf',
    uploadPoReportDecisionNotice: 'po-report-decision-notice.pdf',
    uploadPlansDrawings: 'plans-drawings.pdf',
    uploadDevelopmentPlanPolicies: 'development-plan-policies.pdf',
    uploadEmergingPlan: 'emerging-plan.pdf',
    uploadOtherPolicies: 'other-policies.pdf',
    uploadSupplementaryPlanningDocs: 'supplementary-planning-docs.pdf',
    uploadCommunityInfrastructureLevy: 'community-infrastructure-levy.pdf'  
};
export const houseHolderQuestionnaireTestCases = [
    {  
        constraintsAndDesignations:{
            isCorrectTypeOfAppeal: true,
            isAffectListedBuildings: true,           
            isAffectedListedBuildings: true,
            isConservationArea: true,
            isGreenBelt: true,
        },
        notifyParties:{

        },
        consultResponseAndRepresent:{
            isOtherPartyRepresentations: true,
        },
        poReportAndSupportDocs:{
            isEmergingPlan: true,
            isSupplementaryPlanningDocs: true,
        },
        siteAccess:{
            isLpaSiteAccess: true,
            isNeighbourSiteAccess: true,
            isLpaSiteSafetyRisks: true,
        },
        appealProcess:{
            isOngoingAppeals: true,
            isNearbyAppeals: true,
            isNewConditions: true,
        },
        documents,
        submit:{}
    },
    {  
        constraintsAndDesignations:{
            isCorrectTypeOfAppeal: false,
            isAffectListedBuildings: false,           
            isAffectedListedBuildings: false,
            isConservationArea: false,
            isGreenBelt: false,
        },
        notifyParties:{

        },
        consultResponseAndRepresent:{
            isOtherPartyRepresentations: false,
        },
        poReportAndSupportDocs:{
            isEmergingPlan: false,
            isSupplementaryPlanningDocs: false,
        },
        siteAccess:{
            isLpaSiteAccess: false,
            isNeighbourSiteAccess: false,
            isLpaSiteSafetyRisks: false,
        },
        appealProcess:{
            isOngoingAppeals: false,
            isNearbyAppeals: false,
            isNewConditions: false,
        },
        documents,
        submit:{}
    },
    {  
        constraintsAndDesignations:{
            isCorrectTypeOfAppeal: true,
            isAffectListedBuildings: false,
            
            isAffectedListedBuildings: true,
            isConservationArea: true,
            isGreenBelt: true,
        },
        notifyParties:{

        },
        consultResponseAndRepresent:{
            isOtherPartyRepresentations: true,
        },
        poReportAndSupportDocs:{
            isEmergingPlan: true,
            isSupplementaryPlanningDocs: true,
        },
        siteAccess:{
            isLpaSiteAccess: true,
            isNeighbourSiteAccess: true,
            isLpaSiteSafetyRisks: true,
        },
        appealProcess:{
            isOngoingAppeals: true,
            isNearbyAppeals: true,
            isNewConditions: true,
        },
        documents,
        submit:{}
    },
    {  
        constraintsAndDesignations:{
            isCorrectTypeOfAppeal: true,
            isAffectListedBuildings: false,
            
            isAffectedListedBuildings: false,
            isConservationArea: true,
            isGreenBelt: true,
        },
        notifyParties:{

        },
        consultResponseAndRepresent:{
            isOtherPartyRepresentations: true,
        },
        poReportAndSupportDocs:{
            isEmergingPlan: true,
            isSupplementaryPlanningDocs: true,
        },
        siteAccess:{
            isLpaSiteAccess: true,
            isNeighbourSiteAccess: true,
            isLpaSiteSafetyRisks: true,
        },
        appealProcess:{
            isOngoingAppeals: true,
            isNearbyAppeals: true,
            isNewConditions: true,
        },
        documents,
        submit:{}
    },
    {  
        constraintsAndDesignations:{
            isCorrectTypeOfAppeal: true,
            isAffectListedBuildings: false,
            
            isAffectedListedBuildings: false,
            isConservationArea: false,
            isGreenBelt: true,
        },
        notifyParties:{

        },
        consultResponseAndRepresent:{
            isOtherPartyRepresentations: true,
        },
        poReportAndSupportDocs:{
            isEmergingPlan: true,
            isSupplementaryPlanningDocs: true,
        },
        siteAccess:{
            isLpaSiteAccess: true,
            isNeighbourSiteAccess: true,
            isLpaSiteSafetyRisks: true,
        },
        appealProcess:{
            isOngoingAppeals: true,
            isNearbyAppeals: true,
            isNewConditions: true,
        },
        documents,
        submit:{}
    },
    {  
        constraintsAndDesignations:{
            isCorrectTypeOfAppeal: true,
            isAffectListedBuildings: false,
            
            isAffectedListedBuildings: false,
            isConservationArea: false,
            isGreenBelt: false,
        },
        notifyParties:{

        },
        consultResponseAndRepresent:{
            isOtherPartyRepresentations: true,
        },
        poReportAndSupportDocs:{
            isEmergingPlan: true,
            isSupplementaryPlanningDocs: true,
        },
        siteAccess:{
            isLpaSiteAccess: true,
            isNeighbourSiteAccess: true,
            isLpaSiteSafetyRisks: true,
        },
        appealProcess:{
            isOngoingAppeals: true,
            isNearbyAppeals: true,
            isNewConditions: true,
        },
        documents,
        submit:{}
    },
    {  
        constraintsAndDesignations:{
            isCorrectTypeOfAppeal: true,
            isAffectListedBuildings: false,
            
            isAffectedListedBuildings: false,
            isConservationArea: false,
            isGreenBelt: false,
        },
        notifyParties:{

        },
        consultResponseAndRepresent:{
            isOtherPartyRepresentations: false,
        },
        poReportAndSupportDocs:{
            isEmergingPlan: true,
            isSupplementaryPlanningDocs: true,
        },
        siteAccess:{
            isLpaSiteAccess: true,
            isNeighbourSiteAccess: true,
            isLpaSiteSafetyRisks: true,
        },
        appealProcess:{
            isOngoingAppeals: true,
            isNearbyAppeals: true,
            isNewConditions: true,
        },
        documents,
        submit:{}
    },
    {  
        constraintsAndDesignations:{
            isCorrectTypeOfAppeal: true,
            isAffectListedBuildings: false,
            
            isAffectedListedBuildings: false,
            isConservationArea: false,
            isGreenBelt: false,
        },
        notifyParties:{

        },
        consultResponseAndRepresent:{
            isOtherPartyRepresentations: false,
        },
        poReportAndSupportDocs:{
            isEmergingPlan: true,
            isSupplementaryPlanningDocs: true,
        },
        siteAccess:{
            isLpaSiteAccess: true,
            isNeighbourSiteAccess: true,
            isLpaSiteSafetyRisks: true,
        },
        appealProcess:{
            isOngoingAppeals: true,
            isNearbyAppeals: true,
            isNewConditions: true,
        },
        documents,
        submit:{}
    },
    {  
        constraintsAndDesignations:{
            isCorrectTypeOfAppeal: true,
            isAffectListedBuildings: false,
            
            isAffectedListedBuildings: false,
            isConservationArea: false,
            isGreenBelt: false,
        },
        notifyParties:{

        },
        consultResponseAndRepresent:{
            isOtherPartyRepresentations: false,
        },
        poReportAndSupportDocs:{
            isEmergingPlan: false,
            isSupplementaryPlanningDocs: true,
        },
        siteAccess:{
            isLpaSiteAccess: true,
            isNeighbourSiteAccess: true,
            isLpaSiteSafetyRisks: true,
        },
        appealProcess:{
            isOngoingAppeals: true,
            isNearbyAppeals: true,
            isNewConditions: true,
        },
        documents,
        submit:{}
    },
    {  
        constraintsAndDesignations:{
            isCorrectTypeOfAppeal: true,
            isAffectListedBuildings: false,
            
            isAffectedListedBuildings: false,
            isConservationArea: false,
            isGreenBelt: false,
        },
        notifyParties:{

        },
        consultResponseAndRepresent:{
            isOtherPartyRepresentations: false,
        },
        poReportAndSupportDocs:{
            isEmergingPlan: false,
            isSupplementaryPlanningDocs: false,
        },
        siteAccess:{
            isLpaSiteAccess: false,
            isNeighbourSiteAccess: true,
            isLpaSiteSafetyRisks: true,
        },
        appealProcess:{
            isOngoingAppeals: true,
            isNearbyAppeals: true,
            isNewConditions: true,
        },
        documents,
        submit:{}
    },
    {  
        constraintsAndDesignations:{
            isCorrectTypeOfAppeal: true,
            isAffectListedBuildings: false,
            
            isAffectedListedBuildings: false,
            isConservationArea: false,
            isGreenBelt: false,
        },
        notifyParties:{

        },
        consultResponseAndRepresent:{
            isOtherPartyRepresentations: false,
        },
        poReportAndSupportDocs:{
            isEmergingPlan: false,
            isSupplementaryPlanningDocs: false,
        },
        siteAccess:{
            isLpaSiteAccess: false,
            isNeighbourSiteAccess: false,
            isLpaSiteSafetyRisks: true,
        },
        appealProcess:{
            isOngoingAppeals: true,
            isNearbyAppeals: true,
            isNewConditions: true,
        },
        documents,
        submit:{}
    },
    {  
        constraintsAndDesignations:{
            isCorrectTypeOfAppeal: true,
            isAffectListedBuildings: false,
            
            isAffectedListedBuildings: false,
            isConservationArea: false,
            isGreenBelt: false,
        },
        notifyParties:{

        },
        consultResponseAndRepresent:{
            isOtherPartyRepresentations: false,
        },
        poReportAndSupportDocs:{
            isEmergingPlan: false,
            isSupplementaryPlanningDocs: false,
        },
        siteAccess:{
            isLpaSiteAccess: false,
            isNeighbourSiteAccess: false,
            isLpaSiteSafetyRisks: false,
        },
        appealProcess:{
            isOngoingAppeals: true,
            isNearbyAppeals: true,
            isNewConditions: true,
        },
        documents,
        submit:{}
    },
    {  
        constraintsAndDesignations:{
            isCorrectTypeOfAppeal: true,
            isAffectListedBuildings: false,
            
            isAffectedListedBuildings: false,
            isConservationArea: false,
            isGreenBelt: false,
        },
        notifyParties:{

        },
        consultResponseAndRepresent:{
            isOtherPartyRepresentations: false,
        },
        poReportAndSupportDocs:{
            isEmergingPlan: false,
            isSupplementaryPlanningDocs: false,
        },
        siteAccess:{
            isLpaSiteAccess: false,
            isNeighbourSiteAccess: false,
            isLpaSiteSafetyRisks: false,
        },
        appealProcess:{
            isOngoingAppeals: false,
            isNearbyAppeals: true,
            isNewConditions: true,
        },
        documents,
        submit:{}
    },
    {  
        constraintsAndDesignations:{
            isCorrectTypeOfAppeal: true,
            isAffectListedBuildings: false,
            
            isAffectedListedBuildings: false,
            isConservationArea: false,
            isGreenBelt: false,
        },
        notifyParties:{

        },
        consultResponseAndRepresent:{
            isOtherPartyRepresentations: false,
        },
        poReportAndSupportDocs:{
            isEmergingPlan: false,
            isSupplementaryPlanningDocs: false,
        },
        siteAccess:{
            isLpaSiteAccess: false,
            isNeighbourSiteAccess: false,
            isLpaSiteSafetyRisks: false,
        },
        appealProcess:{
            isOngoingAppeals: false,
            isNearbyAppeals: false,
            isNewConditions: true,
        },
        documents,
        submit:{}
    },
    {  
        constraintsAndDesignations:{
            isCorrectTypeOfAppeal: true,
            isAffectListedBuildings: false,
            
            isAffectedListedBuildings: false,
            isConservationArea: false,
            isGreenBelt: false,
        },
        notifyParties:{

        },
        consultResponseAndRepresent:{
            isOtherPartyRepresentations: false,
        },
        poReportAndSupportDocs:{
            isEmergingPlan: false,
            isSupplementaryPlanningDocs: false,
        },
        siteAccess:{
            isLpaSiteAccess: false,
            isNeighbourSiteAccess: false,
            isLpaSiteSafetyRisks: false,
        },
        appealProcess:{
            isOngoingAppeals: false,
            isNearbyAppeals: false,
            isNewConditions: false,
        },
        documents,
        submit:{}
    }
];