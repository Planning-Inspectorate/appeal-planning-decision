
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
export const fullAppealNoDecisionTestCases = 	[
    {
        statusOfOriginalApplication: 'no decision',
        typeOfDecisionRequested: 'inquiry',
        statusOfPlanningObligation: 'in draft',
        typeOfPlanningApplication: 'answer-full-appeal',
        applicationForm: {
            isAppellant: true,
            areaUnits:'hectare',
            appellantInGreenBelt: true,
            isOwnsAllLand: false,
            isOwnsSomeLand: true,
           // knowsAllOwners: 'yes',
            knowsOtherOwners: 'yes',
            isAgriculturalHolding: false,
           // isTenantAgricultureHolding : true,
           // anyOtherTenants: true,
            isInspectorNeedAccess: true,
            isAppellantSiteSafety: true,
            iaUpdateDevelopmentDescription: true,
            appellantProcedurePreference: 'inquiry',
            anyOtherAppeals: true,
            isAppellantLinkedCaseAdd: false            
        },
        uploadDocuments: {
            submitPlanningObligation: true,
            finalisedPlanningStatus: 'ready',
            haveSeparateOwnershipAndLandDecl: true,
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
     {
        statusOfOriginalApplication: 'no decision',
        typeOfDecisionRequested: 'inquiry',
        statusOfPlanningObligation: 'in draft',
        typeOfPlanningApplication: 'answer-full-appeal',
        applicationForm: {
            isAppellant: true,
            areaUnits:'squaremeter',
            appellantInGreenBelt: true,
            isOwnsAllLand: false,
            isOwnsSomeLand: true,
           // knowsAllOwners: 'yes',
            knowsOtherOwners: 'some',
            isAgriculturalHolding: false,
           // isTenantAgricultureHolding : true,
           // anyOtherTenants: true,
            isInspectorNeedAccess: true,
            isAppellantSiteSafety: true,
            iaUpdateDevelopmentDescription: true,
            appellantProcedurePreference: 'inquiry',
            anyOtherAppeals: true,
            isAppellantLinkedCaseAdd: false            
        },
        uploadDocuments: {
            submitPlanningObligation: true,
            finalisedPlanningStatus: 'ready',
            haveSeparateOwnershipAndLandDecl: true,
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
     {
        statusOfOriginalApplication: 'no decision',
        typeOfDecisionRequested: 'inquiry',
        statusOfPlanningObligation: 'in draft',
        typeOfPlanningApplication: 'answer-full-appeal',
        applicationForm: {
            isAppellant: true,
            areaUnits:'squaremeter',
            appellantInGreenBelt: true,
            isOwnsAllLand: false,
            isOwnsSomeLand: true,
           // knowsAllOwners: 'yes',
            knowsOtherOwners: 'no',
            isAgriculturalHolding: false,
           // isTenantAgricultureHolding : true,
           // anyOtherTenants: true,
            isInspectorNeedAccess: true,
            isAppellantSiteSafety: true,
            iaUpdateDevelopmentDescription: true,
            appellantProcedurePreference: 'inquiry',
            anyOtherAppeals: true,
            isAppellantLinkedCaseAdd: false            
        },
        uploadDocuments: {
            submitPlanningObligation: true,
            finalisedPlanningStatus: 'ready',
            haveSeparateOwnershipAndLandDecl: true,
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
     {
        statusOfOriginalApplication: 'no decision',
        typeOfDecisionRequested: 'inquiry',
        statusOfPlanningObligation: 'in draft',
        typeOfPlanningApplication: 'answer-full-appeal',
        applicationForm: {
            isAppellant: true,
            areaUnits:'squaremeter',
            appellantInGreenBelt: true,
            isOwnsAllLand: false,
            isOwnsSomeLand: false,
            knowsAllOwners: 'some',
           // knowsOtherOwners: 'no',
            isAgriculturalHolding: false,
           // isTenantAgricultureHolding : true,
           // anyOtherTenants: true,
            isInspectorNeedAccess: true,
            isAppellantSiteSafety: true,
            iaUpdateDevelopmentDescription: true,
            appellantProcedurePreference: 'inquiry',
            anyOtherAppeals: true,
            isAppellantLinkedCaseAdd: false            
        },
        uploadDocuments: {
            submitPlanningObligation: true,
            finalisedPlanningStatus: 'ready',
            haveSeparateOwnershipAndLandDecl: true,
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
     {
        statusOfOriginalApplication: 'no decision',
        typeOfDecisionRequested: 'inquiry',
        statusOfPlanningObligation: 'in draft',
        typeOfPlanningApplication: 'answer-full-appeal',
        applicationForm: {
            isAppellant: true,
            areaUnits:'squaremeter',
            appellantInGreenBelt: true,
            isOwnsAllLand: false,
            isOwnsSomeLand: false,
            knowsAllOwners: 'no',
           // knowsOtherOwners: 'no',
            isAgriculturalHolding: false,
           // isTenantAgricultureHolding : true,
           // anyOtherTenants: true,
            isInspectorNeedAccess: true,
            isAppellantSiteSafety: true,
            iaUpdateDevelopmentDescription: true,
            appellantProcedurePreference: 'inquiry',
            anyOtherAppeals: true,
            isAppellantLinkedCaseAdd: false            
        },
        uploadDocuments: {
            submitPlanningObligation: true,
            finalisedPlanningStatus: 'ready',
            haveSeparateOwnershipAndLandDecl: true,
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
     {
        statusOfOriginalApplication: 'no decision',
        typeOfDecisionRequested: 'inquiry',
        statusOfPlanningObligation: 'in draft',
        typeOfPlanningApplication: 'answer-full-appeal',
        applicationForm: {
            isAppellant: true,
            areaUnits:'squaremeter',
            appellantInGreenBelt: true,
            isOwnsAllLand: true,
            //isOwnsSomeLand: false,
            //knowsAllOwners: 'no',
           // knowsOtherOwners: 'no',
            isAgriculturalHolding: false,
           // isTenantAgricultureHolding : true,
           // anyOtherTenants: true,
            isInspectorNeedAccess: true,
            isAppellantSiteSafety: true,
            iaUpdateDevelopmentDescription: true,
            appellantProcedurePreference: 'inquiry',
            anyOtherAppeals: true,
            isAppellantLinkedCaseAdd: false            
        },
        uploadDocuments: {
            submitPlanningObligation: true,
            finalisedPlanningStatus: 'ready',
            haveSeparateOwnershipAndLandDecl: true,
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
     {
        statusOfOriginalApplication: 'no decision',
        typeOfDecisionRequested: 'inquiry',
        statusOfPlanningObligation: 'in draft',
        typeOfPlanningApplication: 'answer-full-appeal',
        applicationForm: {
            isAppellant: true,
            areaUnits:'squaremeter',
            appellantInGreenBelt: true,
            isOwnsAllLand: true,
            //isOwnsSomeLand: false,
            //knowsAllOwners: 'no',
           // knowsOtherOwners: 'no',
            isAgriculturalHolding: true,
            isTenantAgricultureHolding : false,
           // anyOtherTenants: true,
            isInspectorNeedAccess: true,
            isAppellantSiteSafety: true,
            iaUpdateDevelopmentDescription: true,
            appellantProcedurePreference: 'inquiry',
            anyOtherAppeals: true,
            isAppellantLinkedCaseAdd: false            
        },
        uploadDocuments: {
            submitPlanningObligation: true,
            finalisedPlanningStatus: 'ready',
            haveSeparateOwnershipAndLandDecl: true,
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
     {
        statusOfOriginalApplication: 'no decision',
        typeOfDecisionRequested: 'inquiry',
        statusOfPlanningObligation: 'in draft',
        typeOfPlanningApplication: 'answer-full-appeal',
        applicationForm: {
            isAppellant: true,
            areaUnits:'squaremeter',
            appellantInGreenBelt: true,
            isOwnsAllLand: true,
            //isOwnsSomeLand: false,
            //knowsAllOwners: 'no',
           // knowsOtherOwners: 'no',
            isAgriculturalHolding: true,
            isTenantAgricultureHolding : true,
            anyOtherTenants: false,
            isInspectorNeedAccess: true,
            isAppellantSiteSafety: true,
            iaUpdateDevelopmentDescription: true,
            appellantProcedurePreference: 'inquiry',
            anyOtherAppeals: true,
            isAppellantLinkedCaseAdd: false            
        },
        uploadDocuments: {
            submitPlanningObligation: true,
            finalisedPlanningStatus: 'ready',
            haveSeparateOwnershipAndLandDecl: true,
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
     {
        statusOfOriginalApplication: 'no decision',
        typeOfDecisionRequested: 'inquiry',
        statusOfPlanningObligation: 'in draft',
        typeOfPlanningApplication: 'answer-full-appeal',
        applicationForm: {
            isAppellant: true,
            areaUnits:'squaremeter',
            appellantInGreenBelt: true,
            isOwnsAllLand: true,
            //isOwnsSomeLand: false,
            //knowsAllOwners: 'no',
           // knowsOtherOwners: 'no',
            isAgriculturalHolding: true,
            isTenantAgricultureHolding : true,
            anyOtherTenants: true,
            isInspectorNeedAccess: true,
            isAppellantSiteSafety: true,
            iaUpdateDevelopmentDescription: true,
            appellantProcedurePreference: 'inquiry',
            anyOtherAppeals: true,
            isAppellantLinkedCaseAdd: false            
        },
        uploadDocuments: {
            submitPlanningObligation: true,
            finalisedPlanningStatus: 'ready',
            haveSeparateOwnershipAndLandDecl: true,
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
     {
        statusOfOriginalApplication: 'no decision',
        typeOfDecisionRequested: 'inquiry',
        statusOfPlanningObligation: 'in draft',
        typeOfPlanningApplication: 'answer-full-appeal',
        applicationForm: {
            isAppellant: true,
            areaUnits:'squaremeter',
            appellantInGreenBelt: true,
            isOwnsAllLand: false,
            isOwnsSomeLand: true,
            //knowsAllOwners: 'no',
            knowsOtherOwners: 'no',
            isAgriculturalHolding: true,
            isTenantAgricultureHolding : false,
            //anyOtherTenants: true,
            isInspectorNeedAccess: false,
            isAppellantSiteSafety: false,
            iaUpdateDevelopmentDescription: false,
            appellantProcedurePreference: 'inquiry',
            anyOtherAppeals: false,
          //  isAppellantLinkedCaseAdd: true            
        },
        uploadDocuments: {
            submitPlanningObligation: true,
            finalisedPlanningStatus: 'ready',
            haveSeparateOwnershipAndLandDecl: true,
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

     }    
]