const documents = {
    uploadAppealStmt: 'appeal-statement-valid.pdf',
    uploadConservationMapGuidance: 'conservation-map-guidance.pdf',
    uploadPlanExtentOrder: 'plan-extent-order.pdf',
    uploadDefinitiveMapStmt: 'definitive-map-stmt.pdf',
    uploadScreeningOpinion: 'screening-openion.pdf',
    uploadReceivedScopingOpinion: 'received-scoping-opinion.pdf',
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
    uploadDevelopmentPlanPolicies: 'development-plan-policies.pdf',
    uploadEmergingPlan: 'emerging-plan.pdf',
    uploadOtherPolicies: 'other-policies.pdf',
    uploadSupplementaryPlanningDocs: 'supplementary-planning-docs.pdf',
    uploadCommunityInfrastructureLevy: 'community-infrastructure-levy.pdf'
};

export const fullAppealQuestionnaireTestCases = [
    {
        constraintsAndDesignations: {
            isCorrectTypeOfAppeal: true,
            isChangesListedBuilding: false,
            isAffectListedBuildings: false,
            isAffectedListedBuildings: false,
            isScheduleMonument: false,
            isConservationArea: false,
            isProtectedSpecies: true,
            isGreenBelt: true,
            isAreaOutstandingBeauty: true,
            isAllDesignatedSite: true,
            isTreePreservationOrder: true,
            isGypsyTraveller: true,
            isPublicRightOfWay: true
        },
        environmentalImpact: {
            isSchedule: 'one',
            isEnvStmt: true,
            // isAgricultureAquaculture: true,
            // isChangeExtensions: false,
            // isChemicalIndustry: false,
            // isEnergyIndustry: false,
            // isExtractiveIndustry: false,
            // isFoodIndustry: false,
            // isInfrastructureProjects: false,
            // isMineralIndustry: false,
            // isOtherProjects: false,
            // isProductionProcessingOfMetals: false,
            // isRubberIndustry: false,
            // isTextileIndustries: false,
            // isTourismLeisure: false,
            //isSensitiveArea:true,
            // isColumn2Threshold: true,
            // isScreeningOpinion: true,
            // isScreenOpenionEnvStmt: true,
            // isReceivedScopingOpinion: true, 
            // isLpaSiteSafetyRisks: true,
        },
        notifyParties: {
        },
        consultResponseAndRepresent: {
            isStatutoryConsultees: true,
            isConsultationResponses: true,
            isOtherPartyRepresentations: true,
        },
        poReportAndSupportDocs: {
            isSelectStatuaryPlan: true,
            isEmergingPlan: true,
            isOtherRelaventPolicies: true,
            isSupplementaryPlanningDocs: true,
            isCommunityInfrastructureLevy: true,
            isCommunityInfrastructureLevyAdopted: true,
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
    },
    {
        constraintsAndDesignations: {
            isCorrectTypeOfAppeal: true,
            isChangesListedBuilding: false,
            isAffectListedBuildings: false,
            isAffectedListedBuildings: false,
            isScheduleMonument: false,
            isConservationArea: false,
            isProtectedSpecies: true,
            isGreenBelt: true,
            isAreaOutstandingBeauty: true,
            isAllDesignatedSite: true,
            isTreePreservationOrder: true,
            isGypsyTraveller: true,
            isPublicRightOfWay: true
        },
        environmentalImpact: {
            isSchedule: 'two',
            isEnvStmt: true,
            isAgricultureAquaculture: true,
            isChangeExtensions: false,
            isChemicalIndustry: false,
            isEnergyIndustry: false,
            isExtractiveIndustry: false,
            isFoodIndustry: false,
            isInfrastructureProjects: false,
            isMineralIndustry: false,
            isOtherProjects: false,
            isProductionProcessingOfMetals: false,
            isRubberIndustry: false,
            isTextileIndustries: false,
            isTourismLeisure: false,
            isSensitiveArea: true,
            isColumn2Threshold: true,
            isScreeningOpinion: true,
            isScreenOpenionEnvStmt: true,
            isReceivedScopingOpinion: true,
            isLpaSiteSafetyRisks: true,
        },
        notifyParties: {
        },
        consultResponseAndRepresent: {
            isStatutoryConsultees: true,
            isConsultationResponses: true,
            isOtherPartyRepresentations: true,
        },
        poReportAndSupportDocs: {
            isSelectStatuaryPlan: true,
            isEmergingPlan: true,
            isOtherRelaventPolicies: true,
            isSupplementaryPlanningDocs: true,
            isCommunityInfrastructureLevy: true,
            isCommunityInfrastructureLevyAdopted: true,
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
    },
    {
        constraintsAndDesignations: {
            isCorrectTypeOfAppeal: true,
            isChangesListedBuilding: false,
            isAffectListedBuildings: false,
            isAffectedListedBuildings: false,
            isScheduleMonument: false,
            isConservationArea: false,
            isProtectedSpecies: true,
            isGreenBelt: true,
            isAreaOutstandingBeauty: true,
            isAllDesignatedSite: true,
            isTreePreservationOrder: true,
            isGypsyTraveller: true,
            isPublicRightOfWay: true
        },
        environmentalImpact: {
            isSchedule: 'no',
            isEnvStmt: true,
            isAgricultureAquaculture: true,
            isChangeExtensions: false,
            isChemicalIndustry: false,
            isEnergyIndustry: false,
            isExtractiveIndustry: false,
            isFoodIndustry: false,
            isInfrastructureProjects: false,
            isMineralIndustry: false,
            isOtherProjects: false,
            isProductionProcessingOfMetals: false,
            isRubberIndustry: false,
            isTextileIndustries: false,
            isTourismLeisure: false,
            isSensitiveArea: true,
            isColumn2Threshold: true,
            isScreeningOpinion: true,
            isScreenOpenionEnvStmt: true,
            isReceivedScopingOpinion: true,
            isLpaSiteSafetyRisks: true,
        },
        notifyParties: {
        },
        consultResponseAndRepresent: {
            isStatutoryConsultees: true,
            isConsultationResponses: true,
            isOtherPartyRepresentations: true,
        },
        poReportAndSupportDocs: {
            isSelectStatuaryPlan: true,
            isEmergingPlan: true,
            isOtherRelaventPolicies: true,
            isSupplementaryPlanningDocs: true,
            isCommunityInfrastructureLevy: true,
            isCommunityInfrastructureLevyAdopted: true,
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
    },
    {
        constraintsAndDesignations: {
            isCorrectTypeOfAppeal: false,
            isChangesListedBuilding: false,
            isAffectListedBuildings: false,
            isAffectedListedBuildings: false,
            isScheduleMonument: false,
            isConservationArea: false,
            isProtectedSpecies: false,
            isGreenBelt: false,
            isAreaOutstandingBeauty: false,
            isAllDesignatedSite: false,
            isTreePreservationOrder: false,
            isGypsyTraveller: false,
            isPublicRightOfWay: false
        },
        environmentalImpact: {
            isSchedule: 'one',
            isEnvStmt: false,
            // isAgricultureAquaculture: true,
            // isChangeExtensions: false,
            // isChemicalIndustry: false,
            // isEnergyIndustry: false,
            // isExtractiveIndustry: false,
            // isFoodIndustry: false,
            // isInfrastructureProjects: false,
            // isMineralIndustry: false,
            // isOtherProjects: false,
            // isProductionProcessingOfMetals: false,
            // isRubberIndustry: false,
            // isTextileIndustries: false,
            // isTourismLeisure: false,
            //isSensitiveArea:true,
            // isColumn2Threshold: true,
            // isScreeningOpinion: true,
            // isScreenOpenionEnvStmt: true,
            // isReceivedScopingOpinion: true,
            // isLpaSiteSafetyRisks: true,
        },
        notifyParties: {
        },
        consultResponseAndRepresent: {
            isStatutoryConsultees: false,
            isConsultationResponses: false,
            isOtherPartyRepresentations: false,
        },
        poReportAndSupportDocs: {
            isSelectStatuaryPlan: true,
            isEmergingPlan: false,
            isOtherRelaventPolicies: true,
            isSupplementaryPlanningDocs: false,
            isCommunityInfrastructureLevy: false,
            isCommunityInfrastructureLevyAdopted: false,
        },
        siteAccess: {
            isLpaSiteAccess: false,
            isNeighbourSiteAccess: false,
            isLpaSiteSafetyRisks: false,
        },
        appealProcess: {
            isProcedureType: 'written',
            isOngoingAppeals: false,
            isNearbyAppeals: false,
            isNewConditions: false,
        },
        documents,
        submit: {}
    }
    // {
    //     constraintsAndDesignations: {
    //         isCorrectTypeOfAppeal: false,
    //         isChangesListedBuilding: true,
    //         isAffectListedBuildings: true,
    //         isAffectedListedBuildings: true,
    //         isScheduleMonument: true,
    //         isConservationArea: true,
    //         isProtectedSpecies: true,
    //         isGreenBelt: true,
    //         isAreaOutstandingBeauty: true,
    //         isAllDesignatedSite: true,
    //         isTreePreservationOrder: true,
    //         isGypsyTraveller: true,
    //         isPublicRightOfWay: true
    //     },
    //     environmentalImpact: {
    //         isSchedule: 'one',
    //         isEnvStmt: false,
    //         // isAgricultureAquaculture: true,
    //         // isChangeExtensions: false,
    //         // isChemicalIndustry: false,
    //         // isEnergyIndustry: false,
    //         // isExtractiveIndustry: false,
    //         // isFoodIndustry: false,
    //         // isInfrastructureProjects: false,
    //         // isMineralIndustry: false,
    //         // isOtherProjects: false,
    //         // isProductionProcessingOfMetals: false,
    //         // isRubberIndustry: false,
    //         // isTextileIndustries: false,
    //         // isTourismLeisure: false,

    //         // isSensitiveArea: true,
    //         // isColumn2Threshold: true,
    //         // isScreeningOpinion: true,
    //         // isScreenOpenionEnvStmt: true,
    //         // isReceivedScopingOpinion: true,
    //         // isLpaSiteSafetyRisks: true,
    //     },
    //     notifyParties: {
    //     },
    //     consultResponseAndRepresent: {
    //         isStatutoryConsultees: false,
    //         isConsultationResponses: true,
    //         isOtherPartyRepresentations: true,
    //     },
    //     poReportAndSupportDocs: {
    //         isSelectStatuaryPlan: true,
    //         isEmergingPlan: false,
    //         isOtherRelaventPolicies: true,
    //         isSupplementaryPlanningDocs: true,
    //         isCommunityInfrastructureLevy: true,
    //         isCommunityInfrastructureLevyAdopted: true,
    //     },
    //     siteAccess: {
    //         isLpaSiteAccess: false,
    //         isNeighbourSiteAccess: true,
    //         isLpaSiteSafetyRisks: true,
    //     },
    //     appealProcess: {
    //         isProcedureType: 'written',
    //         isOngoingAppeals: false,
    //         isNearbyAppeals: true,
    //         isNewConditions: true,
    //     },
    //     documents,
    //     submit: {}
    // }
    // {  
    //     constraintsAndDesignations:{
    //         isCorrectTypeOfAppeal: true,
    //         isChangesListedBuilding: true,
    //         isAffectListedBuildings: false,            
    //         isAffectedListedBuildings: true,
    //         isScheduleMonument:true,
    //         isConservationArea: true,
    //         isProtectedSpecies: true,
    //         isGreenBelt: true,
    //         isAreaOutstandingBeauty: true,
    //         isAllDesignatedSite: true,
    //         isTreePreservationOrder: true,
    //         isGypsyTraveller: true,
    //         isPublicRightOfWay: true
    //     },
    //     environmentalImpact:{            
    //         isSchedule: 'one',            
    //         isEnvStmt: false,
    //         // isAgricultureAquaculture: true,
    //         // isChangeExtensions: false,
    //         // isChemicalIndustry: false,
    //         // isEnergyIndustry: false,
    //         // isExtractiveIndustry: false,
    //         // isFoodIndustry: false,
    //         // isInfrastructureProjects: false,
    //         // isMineralIndustry: false,
    //         // isOtherProjects: false,
    //         // isProductionProcessingOfMetals: false,
    //         // isRubberIndustry: false,
    //         // isTextileIndustries: false,
    //         // isTourismLeisure: false,

    //         // isSensitiveArea: true,
    //         // isColumn2Threshold: true,
    //         // isScreeningOpinion: true,
    //         // isScreenOpenionEnvStmt: true,
    //         // isReceivedScopingOpinion: true,
    //         // isLpaSiteSafetyRisks: true,
    //     },
    //     notifyParties:{
    //     },
    //     consultResponseAndRepresent:{
    //         isStatutoryConsultees: true,
    //         isConsultationResponses: false,
    //         isOtherPartyRepresentations: true,
    //     },
    //     poReportAndSupportDocs:{
    //         isEmergingPlan: true,
    //         isSupplementaryPlanningDocs: false,
    //         isCommunityInfrastructureLevy: true,
    //         isCommunityInfrastructureLevyAdopted: true,
    //     },
    //     siteAccess:{
    //         isLpaSiteAccess: true,
    //         isNeighbourSiteAccess: false,
    //         isLpaSiteSafetyRisks: true,
    //     },
    //     appealProcess:{
    //         isProcedureType: 'written',
    //         isOngoingAppeals: true,
    //         isNearbyAppeals: false,
    //         isNewConditions: true,                    
    //     },
    //     submit:{}
    // },
    // {  
    //     constraintsAndDesignations:{
    //         isCorrectTypeOfAppeal: true,
    //         isChangesListedBuilding: true,
    //         isAffectListedBuildings: true,            
    //         isAffectedListedBuildings: false,
    //         isScheduleMonument:true,
    //         isConservationArea: true,
    //         isProtectedSpecies: true,
    //         isGreenBelt: true,
    //         isAreaOutstandingBeauty: true,
    //         isAllDesignatedSite: true,
    //         isTreePreservationOrder: true,
    //         isGypsyTraveller: true,
    //         isPublicRightOfWay: true
    //     },
    //     environmentalImpact:{            
    //         isSchedule: 'two',            
    //         isEnvStmt: true,
    //         isAgricultureAquaculture: true,
    //         // isChangeExtensions: false,
    //         // isChemicalIndustry: false,
    //         // isEnergyIndustry: false,
    //         // isExtractiveIndustry: false,
    //         // isFoodIndustry: false,
    //         // isInfrastructureProjects: false,
    //         // isMineralIndustry: false,
    //         // isOtherProjects: false,
    //         // isProductionProcessingOfMetals: false,
    //         // isRubberIndustry: false,
    //         // isTextileIndustries: false,
    //         // isTourismLeisure: false,

    //          isSensitiveArea: true,
    //          isColumn2Threshold: true,
    //          isScreeningOpinion: true,
    //          isScreenOpenionEnvStmt: true,
    //          isReceivedScopingOpinion: true,
    //          isLpaSiteSafetyRisks: true,
    //     },
    //     notifyParties:{
    //     },
    //     consultResponseAndRepresent:{
    //         isStatutoryConsultees: true,
    //         isConsultationResponses: true,
    //         isOtherPartyRepresentations: false,
    //     },
    //     poReportAndSupportDocs:{
    //         isEmergingPlan: true,
    //         isSupplementaryPlanningDocs: true,
    //         isCommunityInfrastructureLevy: false,
    //         isCommunityInfrastructureLevyAdopted: true,
    //     },
    //     siteAccess:{
    //         isLpaSiteAccess: true,
    //         isNeighbourSiteAccess: true,
    //         isLpaSiteSafetyRisks: false,
    //     },
    //     appealProcess:{
    //         isProcedureType: 'written',
    //         isOngoingAppeals: true,
    //         isNearbyAppeals: true,
    //         isNewConditions: false,                    
    //     },
    //     submit:{}
    // },
    // {  
    //     constraintsAndDesignations:{
    //         isCorrectTypeOfAppeal: true,
    //         isChangesListedBuilding: true,
    //         isAffectListedBuildings: true,            
    //         isAffectedListedBuildings: true,
    //         isScheduleMonument: false,
    //         isConservationArea: true,
    //         isProtectedSpecies: true,
    //         isGreenBelt: true,
    //         isAreaOutstandingBeauty: true,
    //         isAllDesignatedSite: true,
    //         isTreePreservationOrder: true,
    //         isGypsyTraveller: true,
    //         isPublicRightOfWay: true
    //     },
    //     environmentalImpact:{            
    //         isSchedule: 'two',            
    //         isEnvStmt: true,
    //         // isAgricultureAquaculture: true,
    //          isChangeExtensions: true,
    //         // isChemicalIndustry: false,
    //         // isEnergyIndustry: false,
    //         // isExtractiveIndustry: false,
    //         // isFoodIndustry: false,
    //         // isInfrastructureProjects: false,
    //         // isMineralIndustry: false,
    //         // isOtherProjects: false,
    //         // isProductionProcessingOfMetals: false,
    //         // isRubberIndustry: false,
    //         // isTextileIndustries: false,
    //         // isTourismLeisure: false,

    //          isSensitiveArea: false,
    //          isColumn2Threshold: true,
    //          isScreeningOpinion: true,
    //          isScreenOpenionEnvStmt: true,
    //          isReceivedScopingOpinion: true,
    //          isLpaSiteSafetyRisks: true,
    //     },
    //     notifyParties:{
    //     },
    //     consultResponseAndRepresent:{
    //         isStatutoryConsultees: true,
    //         isConsultationResponses: true,
    //         isOtherPartyRepresentations: true,
    //     },
    //     poReportAndSupportDocs:{
    //         isEmergingPlan: true,
    //         isSupplementaryPlanningDocs: true,
    //         isCommunityInfrastructureLevy: true,
    //         isCommunityInfrastructureLevyAdopted: false,
    //     },
    //     siteAccess:{
    //         isLpaSiteAccess: true,
    //         isNeighbourSiteAccess: true,
    //         isLpaSiteSafetyRisks: true,
    //     },
    //     appealProcess:{
    //         isProcedureType: 'written',
    //         isOngoingAppeals: true,
    //         isNearbyAppeals: true,
    //         isNewConditions: true,                    
    //     },
    //     submit:{}
    // },

    // {  
    //     constraintsAndDesignations:{
    //         isCorrectTypeOfAppeal: true,
    //         isAffectListedBuildings: false,            
    //         isAffectedListedBuildings: true,
    //         isScheduleMonument:true,
    //         isConservationArea: true,
    //         isProtectedSpecies: true,
    //         isGreenBelt: true,
    //         isAreaOutstandingBeauty: true,
    //         isAllDesignatedSite: true,
    //         isTreePreservationOrder: true,
    //         isGypsyTraveller: true,
    //         isPublicRightOfWay: true
    //     },
    //     environmentalImpact:{           
    //         isSchedule: 'one',
    //         isScreenOpenionEnvStmt: true,
    //         isReceivedScopingOpinion: true,
    //         isEnvStmt: true,
    //         isAgricultureAquaculture: true,
    //         isChangeExtensions: false,
    //         isChemicalIndustry: false,
    //         isEnergyIndustry: false,
    //         isExtractiveIndustry: false,
    //         isFoodIndustry: false,
    //         isInfrastructureProjects: false,
    //         isMineralIndustry: false,
    //         isOtherProjects: false,
    //         isProductionProcessingOfMetals: false,
    //         isRubberIndustry: false,
    //         isTextileIndustries: false,
    //         isTourismLeisure: false,
    //         isSensitiveArea:true,
    //     },
    //     notifyParties:{
    //     },
    //     consultResponseAndRepresent:{
    //         isStatutoryConsultees: true,
    //         isConsultationResponses: true,
    //         isOtherPartyRepresentations: true,
    //     },
    //     poReportAndSupportDocs:{
    //         isEmergingPlan: true,
    //         isSupplementaryPlanningDocs: true,
    //         isCommunityInfrastructureLevy: true,
    //         isCommunityInfrastructureLevyAdopted: true,
    //     },
    //     siteAccess:{
    //         isLpaSiteAccess: true,
    //         isNeighbourSiteAccess: true,
    //         isLpaSiteSafetyRisks: true,
    //     },
    //     appealProcess:{
    //         isNearbyAppeals: true,
    //         isNewConditions: true,
    //         isProcedureType: 'written',           
    //     },
    //     submit:{}
    // },
    // {  
    //     constraintsAndDesignations:{
    //         isCorrectTypeOfAppeal: true,
    //         isAffectListedBuildings: false,            
    //         isAffectedListedBuildings: true,
    //         isScheduleMonument:true,
    //         isConservationArea: true,
    //         isProtectedSpecies: true,
    //         isGreenBelt: true,
    //         isAreaOutstandingBeauty: true,
    //         isAllDesignatedSite: true,
    //         isTreePreservationOrder: true,
    //         isGypsyTraveller: true,
    //         isPublicRightOfWay: true
    //     },
    //     environmentalImpact:{           
    //         isSchedule: 'one',
    //         isScreenOpenionEnvStmt: true,
    //         isReceivedScopingOpinion: true,
    //         isEnvStmt: true,
    //         isAgricultureAquaculture: true,
    //         isChangeExtensions: false,
    //         isChemicalIndustry: false,
    //         isEnergyIndustry: false,
    //         isExtractiveIndustry: false,
    //         isFoodIndustry: false,
    //         isInfrastructureProjects: false,
    //         isMineralIndustry: false,
    //         isOtherProjects: false,
    //         isProductionProcessingOfMetals: false,
    //         isRubberIndustry: false,
    //         isTextileIndustries: false,
    //         isTourismLeisure: false,
    //         isSensitiveArea:true,
    //     },
    //     notifyParties:{
    //     },
    //     consultResponseAndRepresent:{
    //         isStatutoryConsultees: true,
    //         isConsultationResponses: true,
    //         isOtherPartyRepresentations: true,
    //     },
    //     poReportAndSupportDocs:{
    //         isEmergingPlan: true,
    //         isSupplementaryPlanningDocs: true,
    //         isCommunityInfrastructureLevy: true,
    //         isCommunityInfrastructureLevyAdopted: true,
    //     },
    //     siteAccess:{
    //         isLpaSiteAccess: true,
    //         isNeighbourSiteAccess: true,
    //         isLpaSiteSafetyRisks: true,
    //     },
    //     appealProcess:{
    //         isNearbyAppeals: true,
    //         isNewConditions: true,
    //         isProcedureType: 'written',           
    //     },
    //     submit:{}
    // },
    // {  
    //     constraintsAndDesignations:{
    //         isCorrectTypeOfAppeal: true,
    //         isAffectListedBuildings: false,            
    //         isAffectedListedBuildings: true,
    //         isConservationArea: true,
    //         isGreenBelt: true,
    //     },
    //     notifyParties:{

    //     },
    //     consultResponseAndRepresent:{
    //         isOtherPartyRepresentations: true,
    //     },
    //     poReportAndSupportDocs:{
    //         isEmergingPlan: true,
    //         isSupplementaryPlanningDocs: true,
    //     },
    //     siteAccess:{
    //         isLpaSiteAccess: true,
    //         isNeighbourSiteAccess: true,
    //         isLpaSiteSafetyRisks: true,
    //     },
    //     appealProcess:{
    //         isNearbyAppeals: true,
    //         isNewConditions: true,
    //     },
    //     submit:{}
    // },
    // {  
    //     constraintsAndDesignations:{
    //         isCorrectTypeOfAppeal: true,
    //         isAffectListedBuildings: false,            
    //         isAffectedListedBuildings: false,
    //         isConservationArea: true,
    //         isGreenBelt: true,
    //     },
    //     notifyParties:{

    //     },
    //     consultResponseAndRepresent:{
    //         isOtherPartyRepresentations: true,
    //     },
    //     poReportAndSupportDocs:{
    //         isEmergingPlan: true,
    //         isSupplementaryPlanningDocs: true,
    //     },
    //     siteAccess:{
    //         isLpaSiteAccess: true,
    //         isNeighbourSiteAccess: true,
    //         isLpaSiteSafetyRisks: true,
    //     },
    //     appealProcess:{
    //         isNearbyAppeals: true,
    //         isNewConditions: true,
    //     },
    //     submit:{}
    // },
    // {  
    //     constraintsAndDesignations:{
    //         isCorrectTypeOfAppeal: true,
    //         isAffectListedBuildings: false,            
    //         isAffectedListedBuildings: false,
    //         isConservationArea: false,
    //         isGreenBelt: true,
    //     },
    //     notifyParties:{

    //     },
    //     consultResponseAndRepresent:{
    //         isOtherPartyRepresentations: true,
    //     },
    //     poReportAndSupportDocs:{
    //         isEmergingPlan: true,
    //         isSupplementaryPlanningDocs: true,
    //     },
    //     siteAccess:{
    //         isLlpaSiteAccess: true,
    //         isNeighbourSiteAccess: true,
    //         isLpaSiteSafetyRisks: true,
    //     },
    //     appealProcess:{
    //         isNearbyAppeals: true,
    //         isNewConditions: true,
    //     },
    //     submit:{}
    // },
    // {  
    //     constraintsAndDesignations:{
    //         isCorrectTypeOfAppeal: true,
    //         isAffectListedBuildings: false,            
    //         isAffectedListedBuildings: false,
    //         isConservationArea: false,
    //         isGreenBelt: false,
    //     },
    //     notifyParties:{

    //     },
    //     consultResponseAndRepresent:{
    //         isOtherPartyRepresentations: true,
    //     },
    //     poReportAndSupportDocs:{
    //         isEmergingPlan: true,
    //         isSupplementaryPlanningDocs: true,
    //     },
    //     siteAccess:{
    //         isLpaSiteAccess: true,
    //         isNeighbourSiteAccess: true,
    //         isLpaSiteSafetyRisks: true,
    //     },
    //     appealProcess:{
    //         isNearbyAppeals: true,
    //         isNewConditions: true,
    //     },
    //     submit:{}
    // },
    // {  
    //     constraintsAndDesignations:{
    //         isCorrectTypeOfAppeal: true,
    //         isAffectListedBuildings: false,            
    //         isAffectedListedBuildings: false,
    //         isConservationArea: false,
    //         isGreenBelt: false,
    //     },
    //     notifyParties:{

    //     },
    //     consultResponseAndRepresent:{
    //         isOtherPartyRepresentations: false,
    //     },
    //     poReportAndSupportDocs:{
    //         isEmergingPlan: true,
    //         isSupplementaryPlanningDocs: true,
    //     },
    //     siteAccess:{
    //         isLpaSiteAccess: true,
    //         isNeighbourSiteAccess: true,
    //         isLpaSiteSafetyRisks: true,
    //     },
    //     appealProcess:{
    //         isNearbyAppeals: true,
    //         isNewConditions: true,
    //     },
    //     submit:{}
    // },
    // {  
    //     constraintsAndDesignations:{
    //         isCorrectTypeOfAppeal: true,
    //         isAffectListedBuildings: false,            
    //         isAffectedListedBuildings: false,
    //         isConservationArea: false,
    //         isGreenBelt: false,
    //     },
    //     notifyParties:{

    //     },
    //     consultResponseAndRepresent:{
    //         isOtherPartyRepresentations: false,
    //     },
    //     poReportAndSupportDocs:{
    //         isEmergingPlan: false,
    //         isSupplementaryPlanningDocs: true,
    //     },
    //     siteAccess:{
    //         isLpaSiteAccess: true,
    //         isNeighbourSiteAccess: true,
    //         isLpaSiteSafetyRisks: true,
    //     },
    //     appealProcess:{
    //         isNearbyAppeals: true,
    //         isNewConditions: true,
    //     },
    //     submit:{}
    // },
    // {  
    //     constraintsAndDesignations:{
    //         isCorrectTypeOfAppeal: true,
    //         isAffectListedBuildings: false,            
    //         isAffectedListedBuildings: false,
    //         isConservationArea: false,
    //         isGreenBelt: false,
    //     },
    //     notifyParties:{

    //     },
    //     consultResponseAndRepresent:{
    //         isOtherPartyRepresentations: false,
    //     },
    //     poReportAndSupportDocs:{
    //         isEmergingPlan: false,
    //         isSupplementaryPlanningDocs: false,
    //     },
    //     siteAccess:{
    //         isLpaSiteAccess: true,
    //         isNeighbourSiteAccess: true,
    //         isLpaSiteSafetyRisks: true,
    //     },
    //     appealProcess:{
    //         isNearbyAppeals: true,
    //         isNewConditions: true,
    //     },
    //     submit:{}
    // },
    // {  
    //     constraintsAndDesignations:{
    //         isCorrectTypeOfAppeal: true,
    //         isAffectListedBuildings: false,            
    //         isAffectedListedBuildings: false,
    //         isConservationArea: false,
    //         isGreenBelt: false,
    //     },
    //     notifyParties:{

    //     },
    //     consultResponseAndRepresent:{
    //         isOtherPartyRepresentations: false,
    //     },
    //     poReportAndSupportDocs:{
    //         isEmergingPlan: false,
    //         isSupplementaryPlanningDocs: false,
    //     },
    //     siteAccess:{
    //         isLpaSiteAccess: false,
    //         isNeighbourSiteAccess: true,
    //         isLpaSiteSafetyRisks: true,
    //     },
    //     appealProcess:{
    //         isNearbyAppeals: true,
    //         isNewConditions: true,
    //     },
    //     submit:{}
    // },
    // {  
    //     constraintsAndDesignations:{
    //         isCorrectTypeOfAppeal: true,
    //         isAffectListedBuildings: false,            
    //         isAffectedListedBuildings: false,
    //         isConservationArea: false,
    //         isGreenBelt: false,
    //     },
    //     notifyParties:{

    //     },
    //     consultResponseAndRepresent:{
    //         isOtherPartyRepresentations: false,
    //     },
    //     poReportAndSupportDocs:{
    //         isEmergingPlan: false,
    //         isSupplementaryPlanningDocs: false,
    //     },
    //     siteAccess:{
    //         isLpaSiteAccess: false,
    //         isNeighbourSiteAccess: false,
    //         isLpaSiteSafetyRisks: true,
    //     },
    //     appealProcess:{
    //         isNearbyAppeals: true,
    //         isNewConditions: true,
    //     },
    //     submit:{}
    // },
    // {  
    //     constraintsAndDesignations:{
    //         isCorrectTypeOfAppeal: true,
    //         isAffectListedBuildings: false,            
    //         isAffectedListedBuildings: false,
    //         isConservationArea: false,
    //         isGreenBelt: false,
    //     },
    //     notifyParties:{

    //     },
    //     consultResponseAndRepresent:{
    //         isOtherPartyRepresentations: false,
    //     },
    //     poReportAndSupportDocs:{
    //         isEmergingPlan: false,
    //         isSupplementaryPlanningDocs: false,
    //     },
    //     siteAccess:{
    //         isLpaSiteAccess: false,
    //         isNeighbourSiteAccess: false,
    //         isLpaSiteSafetyRisks: false,
    //     },
    //     appealProcess:{
    //         isNearbyAppeals: true,
    //         isNewConditions: true,
    //     },
    //     submit:{}
    // },
    // {  
    //     constraintsAndDesignations:{
    //         isCorrectTypeOfAppeal: true,
    //         isAffectListedBuildings: false,            
    //         isAffectedListedBuildings: false,
    //         isConservationArea: false,
    //         isGreenBelt: false,
    //     },
    //     notifyParties:{

    //     },
    //     consultResponseAndRepresent:{
    //         isOtherPartyRepresentations: false,
    //     },
    //     poReportAndSupportDocs:{
    //         isEmergingPlan: false,
    //         isSupplementaryPlanningDocs: false,
    //     },
    //     siteAccess:{
    //         isLpaSiteAccess: false,
    //         isNeighbourSiteAccess: false,
    //         isLpaSiteSafetyRisks: false,
    //     },
    //     appealProcess:{
    //         isNearbyAppeals: false,
    //         isNewConditions: true,
    //     },
    //     submit:{}
    // },
    // {  
    //     constraintsAndDesignations:{
    //         isCorrectTypeOfAppeal: true,
    //         isAffectListedBuildings: false,            
    //         isAffectedListedBuildings: false,
    //         isConservationArea: false,
    //         isGreenBelt: false,
    //     },
    //     notifyParties:{

    //     },
    //     consultResponseAndRepresent:{
    //         isOtherPartyRepresentations: false,
    //     },
    //     poReportAndSupportDocs:{
    //         isEmergingPlan: false,
    //         isSupplementaryPlanningDocs: false,
    //     },
    //     siteAccess:{
    //         isLpaSiteAccess: false,
    //         isNeighbourSiteAccess: false,
    //         isLpaSiteSafetyRisks: false,
    //     },
    //     appealProcess:{
    //         isNearbyAppeals: false,
    //         isNewConditions: false,
    //     },
    //     submit:{}
    // }
];