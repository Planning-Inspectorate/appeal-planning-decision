const documents = {
    uploadAppealStmt:'appeal-statement-valid.pdf',
    uploadApplicationForAppealCost:'other-supporting-docs.pdf',
    uploadNewPlanOrDrawing:'plans-drawings.jpeg',
    uploadOtherNewSupportDoc:'other-supporting-docs.pdf',
    uploadSeparateOwnershipCertAndAgricultureDoc:'draft-planning-obligation.pdf',
    uploadDesignAndAccessStmt:'design-and-access-statement.pdf',
    uploadPlansDrawingAndSupportingDocs:'plans-drawings-and-supporting-documents.pdf',
    uploadFinalisingDocReady:'additional-final-comments-2.pdf',
    uploadFinalisingDocDraft:'additional-final-comments-2.pdf',
    uploadDevelopmentDescription:'additional-final-comments-1.pdf',
    uploadDecisionLetter:'decision-letter.pdf', 
    uploadPlanningApplConfirmLetter:'letter-confirming-planning-application.pdf'          
};
export const houseHolderAppealRefusedTestCases=	[
    {
        statusOfOriginalApplication: 'refused',
        typeOfDecisionRequested: 'hearing',
        statusOfPlanningObligation: 'in draft',
        typeOfPlanningApplication: 'answer-householder-planning',
        applicationForm: {
            isAppellant: true,
            //areaUnits:'hectare',
            appellantInGreenBelt: true,
            isOwnsAllLand: false,
            isOwnsSomeLand: true,
            knowsAllOwners: 'no',
            knowsOtherOwners:'yes',
            //isAgriculturalHolding: false,
            isTenantAgricultureHolding : true,
            anyOtherTenants: true,
            isInspectorNeedAccess: true,
            isAppellantSiteSafety: true,
            iaUpdateDevelopmentDescription: true,
            appellantProcedurePreference: 'hearing',
            anyOtherAppeals: true,
            isAppellantLinkedCaseAdd: false            
        },
        uploadDocuments: {
            submitPlanningObligation: true,
            finalisedPlanningStatus: 'ready',
            isApplyAwardCost: true,
            isSubmitDesignAndAccessStmt: true,
            isNewPlanOrDrawingAvailable: true,
            isOtherNewDocumentAvailable: true
        },
        documents,
        otherAppeals: [{
            appealReferenceNumber: '1234567'
        }, {
            appealReferenceNumber: '7654321'
        }],				
        finalComments: {
            check: false, // TODO: set these to true after feature flag introduced
            uploadAdditionalDocuments: false
        }
    },
    // refused scenarios 
    // {
    //     statusOfOriginalApplication: 'refused',
    //     typeOfDecisionRequested: 'hearing',
    //     statusOfPlanningObligation: 'in draft',
    //     typeOfPlanningApplication: 'answer-householder-planning',
    //     applicationForm: {
    //         isAppellant: true,
    //         areaUnits:'squaremeter',
    //         appellantInGreenBelt: true,
    //         isOwnsAllLand: false,
    //         isOwnsSomeLand: true,
    //         knowsAllOwners: 'no',
    //         knowsOtherOwners:'yes',				
    //         isInspectorNeedAccess: true,
    //         isAppellantSiteSafety: true,
    //         iaUpdateDevelopmentDescription: true,				
    //         anyOtherAppeals: true,
    //         isAppellantLinkedCaseAdd: false            
    //     },
    //     uploadDocuments: {			
    //         isApplyAwardCost: true			
    //     },
    //     documents,
    //     otherAppeals: [{
    //         appealReferenceNumber: '1234567'
    //     }, {
    //         appealReferenceNumber: '7654321'
    //     }],				
    //     finalComments: {
    //         check: false, // TODO: set these to true after feature flag introduced
    //         uploadAdditionalDocuments: false
    //     }
    // },
    // {
    //     statusOfOriginalApplication: 'refused',
    //     typeOfDecisionRequested: 'hearing',
    //     statusOfPlanningObligation: 'in draft',
    //     typeOfPlanningApplication: 'answer-householder-planning',
    //     applicationForm: {
    //         isAppellant: true,
    //         areaUnits:'squaremeter',
    //         appellantInGreenBelt: true,
    //         isOwnsAllLand: false,
    //         isOwnsSomeLand: true,
    //         knowsAllOwners: 'no',
    //         knowsOtherOwners:'yes',				
    //         isInspectorNeedAccess: true,
    //         isAppellantSiteSafety: true,
    //         iaUpdateDevelopmentDescription: true,				
    //         anyOtherAppeals: true,
    //         isAppellantLinkedCaseAdd: true            
    //     },
    //     uploadDocuments: {			
    //         isApplyAwardCost: true			
    //     },
    //     documents,
    //     otherAppeals: [{
    //         appealReferenceNumber: '1234567'
    //     }, {
    //         appealReferenceNumber: '7654321'
    //     }],				
    //     finalComments: {
    //         check: false, // TODO: set these to true after feature flag introduced
    //         uploadAdditionalDocuments: false
    //     }			
    // },
    // {
    //     statusOfOriginalApplication: 'refused',
    //     typeOfDecisionRequested: 'hearing',
    //     statusOfPlanningObligation: 'in draft',
    //     typeOfPlanningApplication: 'answer-householder-planning',
    //     applicationForm: {
    //         isAppellant: true,
    //         areaUnits:'squaremeter',
    //         appellantInGreenBelt: true,
    //         isOwnsAllLand: false,
    //         isOwnsSomeLand: true,
    //         knowsAllOwners: 'no',
    //         knowsOtherOwners:'yes',				
    //         isInspectorNeedAccess: true,
    //         isAppellantSiteSafety: true,
    //         iaUpdateDevelopmentDescription: true,				
    //         anyOtherAppeals: false,
    //         isAppellantLinkedCaseAdd: true            
    //     },
    //     uploadDocuments: {			
    //         isApplyAwardCost: true			
    //     },
    //     documents,
    //     otherAppeals: [{
    //         appealReferenceNumber: '1234567'
    //     }, {
    //         appealReferenceNumber: '7654321'
    //     }],				
    //     finalComments: {
    //         check: false, // TODO: set these to true after feature flag introduced
    //         uploadAdditionalDocuments: false
    //     }			
    // },
    
    // {
    //     statusOfOriginalApplication: 'refused',
    //     typeOfDecisionRequested: 'hearing',
    //     statusOfPlanningObligation: 'in draft',
    //     typeOfPlanningApplication: 'answer-householder-planning',
    //     applicationForm: {
    //         isAppellant: true,
    //         areaUnits:'squaremeter',
    //         appellantInGreenBelt: true,
    //         isOwnsAllLand: false,
    //         isOwnsSomeLand: true,
    //         knowsAllOwners: 'no',
    //         knowsOtherOwners:'yes',				
    //         isInspectorNeedAccess: true,
    //         isAppellantSiteSafety: true,
    //         iaUpdateDevelopmentDescription: false,				
    //         anyOtherAppeals: false,
    //         isAppellantLinkedCaseAdd: true            
    //     },
    //     uploadDocuments: {			
    //         isApplyAwardCost: true			
    //     },
    //     documents,
    //     otherAppeals: [{
    //         appealReferenceNumber: '1234567'
    //     }, {
    //         appealReferenceNumber: '7654321'
    //     }],				
    //     finalComments: {
    //         check: false, // TODO: set these to true after feature flag introduced
    //         uploadAdditionalDocuments: false
    //     }			
    // },
    // {
    //     statusOfOriginalApplication: 'refused',
    //     typeOfDecisionRequested: 'hearing',
    //     statusOfPlanningObligation: 'in draft',
    //     typeOfPlanningApplication: 'answer-householder-planning',
    //     applicationForm: {
    //         isAppellant: true,
    //         areaUnits:'squaremeter',
    //         appellantInGreenBelt: true,
    //         isOwnsAllLand: false,
    //         isOwnsSomeLand: true,
    //         knowsAllOwners: 'no',
    //         knowsOtherOwners:'yes',				
    //         isInspectorNeedAccess: false,
    //         isAppellantSiteSafety: false,
    //         iaUpdateDevelopmentDescription: false,				
    //         anyOtherAppeals: false,
    //         isAppellantLinkedCaseAdd: true            
    //     },
    //     uploadDocuments: {			
    //         isApplyAwardCost: true			
    //     },
    //     documents,        
    //     otherAppeals: [{
    //         appealReferenceNumber: '1234567'
    //     }, {
    //         appealReferenceNumber: '7654321'
    //     }],				
    //     finalComments: {
    //         check: false, // TODO: set these to true after feature flag introduced
    //         uploadAdditionalDocuments: false
    //     }			
    // },
    // {
    //     statusOfOriginalApplication: 'refused',
    //     typeOfDecisionRequested: 'hearing',
    //     statusOfPlanningObligation: 'in draft',
    //     typeOfPlanningApplication: 'answer-householder-planning',
    //     applicationForm: {
    //         isAppellant: true,
    //         areaUnits:'squaremeter',
    //         appellantInGreenBelt: true,
    //         isOwnsAllLand: true,
    //         //isOwnsSomeLand: true,
    //         //knowsAllOwners: 'no',
    //         //knowsOtherOwners:'yes',				
    //         isInspectorNeedAccess: false,
    //         isAppellantSiteSafety: false,
    //         iaUpdateDevelopmentDescription: false,				
    //         anyOtherAppeals: false,
    //         isAppellantLinkedCaseAdd: true            
    //     },
    //     uploadDocuments: {			
    //         isApplyAwardCost: true			
    //     },
    //     documents,
    //     otherAppeals: [{
    //         appealReferenceNumber: '1234567'
    //     }, {
    //         appealReferenceNumber: '7654321'
    //     }],				
    //     finalComments: {
    //         check: false, // TODO: set these to true after feature flag introduced
    //         uploadAdditionalDocuments: false
    //     }			
    // },
    // {
    //     statusOfOriginalApplication: 'refused',
    //     typeOfDecisionRequested: 'hearing',
    //     statusOfPlanningObligation: 'in draft',
    //     typeOfPlanningApplication: 'answer-householder-planning',
    //     applicationForm: {
    //         isAppellant: true,
    //         areaUnits:'squaremeter',
    //         appellantInGreenBelt: false,
    //         isOwnsAllLand: true,
    //         //isOwnsSomeLand: true,
    //         //knowsAllOwners: 'no',
    //         //knowsOtherOwners:'yes',				
    //         isInspectorNeedAccess: false,
    //         isAppellantSiteSafety: false,
    //         iaUpdateDevelopmentDescription: false,				
    //         anyOtherAppeals: false,
    //         isAppellantLinkedCaseAdd: true            
    //     },
    //     uploadDocuments: {			
    //         isApplyAwardCost: true			
    //     },
    //     documents,
    //     otherAppeals: [{
    //         appealReferenceNumber: '1234567'
    //     }, {
    //         appealReferenceNumber: '7654321'
    //     }],				
    //     finalComments: {
    //         check: false, // TODO: set these to true after feature flag introduced
    //         uploadAdditionalDocuments: false
    //     }			
    // },
    // {
    //     statusOfOriginalApplication: 'refused',
    //     typeOfDecisionRequested: 'hearing',
    //     statusOfPlanningObligation: 'in draft',
    //     typeOfPlanningApplication: 'answer-householder-planning',
    //     applicationForm: {
    //         isAppellant: false,
    //         areaUnits:'squaremeter',
    //         appellantInGreenBelt: false,
    //         isOwnsAllLand: true,
    //         //isOwnsSomeLand: true,
    //         //knowsAllOwners: 'no',
    //         //knowsOtherOwners:'yes',				
    //         isInspectorNeedAccess: false,
    //         isAppellantSiteSafety: false,
    //         iaUpdateDevelopmentDescription: false,				
    //         anyOtherAppeals: false,
    //         isAppellantLinkedCaseAdd: true            
    //     },
    //     uploadDocuments: {			
    //         isApplyAwardCost: true			
    //     },
    //     documents,
    //     otherAppeals: [{
    //         appealReferenceNumber: '1234567'
    //     }, {
    //         appealReferenceNumber: '7654321'
    //     }],				
    //     finalComments: {
    //         check: false, // TODO: set these to true after feature flag introduced
    //         uploadAdditionalDocuments: false
    //     }			
    // },
    // {
    //     statusOfOriginalApplication: 'refused',
    //     typeOfDecisionRequested: 'hearing',
    //     statusOfPlanningObligation: 'in draft',
    //     typeOfPlanningApplication: 'answer-householder-planning',
    //     applicationForm: {
    //         isAppellant: false,
    //         areaUnits:'squaremeter',
    //         appellantInGreenBelt: false,
    //         isOwnsAllLand: true,
    //         //isOwnsSomeLand: true,
    //         //knowsAllOwners: 'no',
    //         //knowsOtherOwners:'yes',				
    //         isInspectorNeedAccess: false,
    //         isAppellantSiteSafety: false,
    //         iaUpdateDevelopmentDescription: false,				
    //         anyOtherAppeals: false,
    //         isAppellantLinkedCaseAdd: true            
    //     },
    //     uploadDocuments: {			
    //         isApplyAwardCost: true			
    //     },
    //     documents,
    //     otherAppeals: [{
    //         appealReferenceNumber: '1234567'
    //     }, {
    //         appealReferenceNumber: '7654321'
    //     }],				
    //     finalComments: {
    //         check: false, // TODO: set these to true after feature flag introduced
    //         uploadAdditionalDocuments: false
    //     }			
    // }
];