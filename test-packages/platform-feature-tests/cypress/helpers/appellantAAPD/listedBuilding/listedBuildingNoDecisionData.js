
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
    uploadPlanningApplConfirmLetter:'letter-confirming-planning-application.pdf',
    uploadDraftStatementOfCommonGround: 'draft-statement-of-common-ground.pdf'        
};
export const listedBuildingNoDecisionTestCases = 	[
    {
        statusOfOriginalApplication: 'no decision',
        typeOfDecisionRequested: 'written',
        statusOfPlanningObligation: 'in draft',
        typeOfPlanningApplication: 'answer-listed-building',
        applicationForm: {
            isAppellant: true,
            areaUnits:'hectare',
            appellantInGreenBelt: true,
            isOwnsAllLand: false,
            isOwnsSomeLand: true,
           // knowsAllOwners: 'yes',
            knowsOtherOwners: 'yes',            
            isInspectorNeedAccess: true,
            isAppellantSiteSafety: true,
            majorMionorDevelopmentData: 'major',
            applicationAboutData: 'householder',
            iaUpdateDevelopmentDescription: true,
            appellantProcedurePreference: 'written',
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
        typeOfDecisionRequested: 'hearing',
        statusOfPlanningObligation: 'in draft',
        typeOfPlanningApplication: 'answer-listed-building',
        applicationForm: {
            isAppellant: true,
            areaUnits:'squaremeter',
            appellantInGreenBelt: true,
            isOwnsAllLand: false,
            isOwnsSomeLand: true,
           // knowsAllOwners: 'yes',
            knowsOtherOwners: 'some',            
            majorMionorDevelopmentData: 'minor',
            applicationAboutData: 'changeofuse',
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
        typeOfPlanningApplication: 'answer-listed-building',
        applicationForm: {
            isAppellant: true,
            areaUnits:'squaremeter',
            appellantInGreenBelt: true,
            isOwnsAllLand: false,
            isOwnsSomeLand: true,
           // knowsAllOwners: 'yes',
            knowsOtherOwners: 'no',           
            majorMionorDevelopmentData: 'other',
            applicationAboutData: 'mineralworkings',
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
        typeOfDecisionRequested: 'written',
        statusOfPlanningObligation: 'in draft',
        typeOfPlanningApplication: 'answer-listed-building',
        applicationForm: {
            isAppellant: true,
            areaUnits:'squaremeter',
            appellantInGreenBelt: true,
            isOwnsAllLand: false,
            isOwnsSomeLand: false,
            knowsAllOwners: 'some',
           // knowsOtherOwners: 'no',           
            majorMionorDevelopmentData: 'major',
            applicationAboutData: 'dwellings',
            isInspectorNeedAccess: true,
            isAppellantSiteSafety: true,
            iaUpdateDevelopmentDescription: true,
            appellantProcedurePreference: 'written',
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
        typeOfDecisionRequested: 'hearing',
        statusOfPlanningObligation: 'in draft',
        typeOfPlanningApplication: 'answer-listed-building',
        applicationForm: {
            isAppellant: true,
            areaUnits:'squaremeter',
            appellantInGreenBelt: true,
            isOwnsAllLand: false,
            isOwnsSomeLand: false,
            knowsAllOwners: 'no',
           // knowsOtherOwners: 'no',           
            majorMionorDevelopmentData: 'minor',
            applicationAboutData: 'industrystorage',
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
        typeOfPlanningApplication: 'answer-listed-building',
        applicationForm: {
            isAppellant: true,
            areaUnits:'squaremeter',
            appellantInGreenBelt: true,
            isOwnsAllLand: true,
            //isOwnsSomeLand: false,
            //knowsAllOwners: 'no',
           // knowsOtherOwners: 'no',           
            majorMionorDevelopmentData: 'other',
            applicationAboutData: 'offices',
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
        typeOfDecisionRequested: 'written',
        statusOfPlanningObligation: 'in draft',
        typeOfPlanningApplication: 'answer-listed-building',
        applicationForm: {
            isAppellant: true,
            areaUnits:'squaremeter',
            appellantInGreenBelt: true,
            isOwnsAllLand: true,
            //isOwnsSomeLand: false,
            //knowsAllOwners: 'no',
           // knowsOtherOwners: 'no',         
            majorMionorDevelopmentData: 'major',
            applicationAboutData: 'retailservices',
            isInspectorNeedAccess: true,
            isAppellantSiteSafety: true,
            iaUpdateDevelopmentDescription: true,
            appellantProcedurePreference: 'written',
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
        typeOfDecisionRequested: 'hearing',
        statusOfPlanningObligation: 'in draft',
        typeOfPlanningApplication: 'answer-listed-building',
        applicationForm: {
            isAppellant: true,
            areaUnits:'squaremeter',
            appellantInGreenBelt: true,
            isOwnsAllLand: true,
            //isOwnsSomeLand: false,
            //knowsAllOwners: 'no',
           // knowsOtherOwners: 'no',            
            majorMionorDevelopmentData: 'minor',
            applicationAboutData: 'travellercaravan',
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
        }]
     },
     {
        statusOfOriginalApplication: 'no decision',
        typeOfDecisionRequested: 'inquiry',
        statusOfPlanningObligation: 'in draft',
        typeOfPlanningApplication: 'answer-listed-building',
        applicationForm: {
            isAppellant: true,
            areaUnits:'squaremeter',
            appellantInGreenBelt: true,
            isOwnsAllLand: true,
            //isOwnsSomeLand: false,
            //knowsAllOwners: 'no',
           // knowsOtherOwners: 'no',            
            majorMionorDevelopmentData: 'other',
            applicationAboutData: 'other',
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
        typeOfDecisionRequested: 'written',
        statusOfPlanningObligation: 'in draft',
        typeOfPlanningApplication: 'answer-listed-building',
        applicationForm: {
            isAppellant: true,
            areaUnits:'squaremeter',
            appellantInGreenBelt: true,
            isOwnsAllLand: false,
            isOwnsSomeLand: true,
            //knowsAllOwners: 'no',
            knowsOtherOwners: 'no',            
            majorMionorDevelopmentData: 'major',
            applicationAboutData: 'householder',
            isInspectorNeedAccess: false,
            isAppellantSiteSafety: false,
            iaUpdateDevelopmentDescription: false,
            appellantProcedurePreference: 'written',
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
     }    
]