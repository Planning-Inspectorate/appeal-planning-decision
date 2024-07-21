
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
export const fullAppealRefusedTestCases = 	[
    {
        statusOfOriginalApplication: 'refused',
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
        statusOfOriginalApplication: 'refused',
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
        statusOfOriginalApplication: 'refused',
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
        statusOfOriginalApplication: 'refused',
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
        statusOfOriginalApplication: 'refused',
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
        statusOfOriginalApplication: 'refused',
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
        statusOfOriginalApplication: 'refused',
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
        statusOfOriginalApplication: 'refused',
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
        statusOfOriginalApplication: 'refused',
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
        statusOfOriginalApplication: 'refused',
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

     },
     //  ===========================    old test cases   ================
    //  {
    //     statusOfOriginalApplication: 'refused',
    //     typeOfDecisionRequested: 'hearing',
    //     statusOfPlanningObligation: 'in draft',
    //     typeOfPlanningApplication: 'answer-full-appeal',
    //     applicationForm: {
    //         isAppellant: true,
    //         areaUnits:'hectare',
    //         appellantInGreenBelt: false,
    //         isOwnsAllLand: false,
    //         isOwnsSomeLand: false,
    //         knowsAllOwners: 'no',
    //         knowsOtherOwners:'some',
    //         isAgriculturalHolding: true,
    //         isTenantAgricultureHolding : true,
    //         anyOtherTenants : true,
    //         isInspectorNeedAccess : true				
    //     },
    //     finalComments: {
    //         check: false, // TODO: set these to true after feature flag introduced
    //         uploadAdditionalDocuments: false
    //     },
    //     expectedFilesAndFoldersInHorizon: [
    //         {
    //             expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
    //             expectedFileName: 'planning-application-form.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: [
    //                 '0 Inspector File',
    //                 "01 Appelant's Initial Documents",
    //                 '05 Plans',
    //                 '01 Application Plans'
    //             ],
    //             expectedFileName: 'plans-drawings-and-supporting-documents.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
    //             expectedFileName: 'design-and-access-statement.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
    //             expectedFileName: 'draft-statement-of-common-ground.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
    //             expectedFileName: 'letter-confirming-planning-application.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: [
    //                 '0 Inspector File',
    //                 "01 Appelant's Initial Documents",
    //                 '02 Statement and appendicies'
    //             ],
    //             expectedFileName: 'ownership-certificate-and-agricultural-land-declaration.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
    //             expectedFileName: 'letter-confirming-planning-obligation.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: [
    //                 '0 Inspector File',
    //                 "01 Appelant's Initial Documents",
    //                 '05 Plans',
    //                 '02 Plans submitted after LPA decision'
    //             ],
    //             expectedFileName: 'plans-drawings.jpeg'
    //         },
    //         {
    //             expectedFolderHierarchy: ['0 Inspector File', '07 Planning Obligation'],
    //             expectedFileName: 'draft-planning-obligation.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: ['1 Main Party', 'Appellant/Agent/Applicant'],
    //             expectedFileName: 'other-supporting-documents.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: [
    //                 '0 Inspector File',
    //                 '05 Final comments',
    //                 'Appellant final comments'
    //             ],
    //             expectedFileName: 'final-comments.pdf'
    //         }
            
    //     ]
    //  },
    //  {
    //     statusOfOriginalApplication: 'refused',
    //     typeOfDecisionRequested: 'hearing',
    //     statusOfPlanningObligation: 'in draft',
    //     typeOfPlanningApplication: 'answer-full-appeal',
    //     applicationForm: {
    //         isAppellant: true,
    //         areaUnits:'hectare',
    //         appellantInGreenBelt: false,
    //         isOwnsAllLand: false,
    //         isOwnsSomeLand: false,
    //         knowsAllOwners: 'no',
    //         knowsOtherOwners:'no',
    //         isAgriculturalHolding: true,
    //         isTenantAgricultureHolding : true,
    //         anyOtherTenants : true,
    //         isInspectorNeedAccess : true				
    //     },
    //     finalComments: {
    //         check: false, // TODO: set these to true after feature flag introduced
    //         uploadAdditionalDocuments: false
    //     },
    //     expectedFilesAndFoldersInHorizon: [
    //         {
    //             expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
    //             expectedFileName: 'planning-application-form.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: [
    //                 '0 Inspector File',
    //                 "01 Appelant's Initial Documents",
    //                 '05 Plans',
    //                 '01 Application Plans'
    //             ],
    //             expectedFileName: 'plans-drawings-and-supporting-documents.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
    //             expectedFileName: 'design-and-access-statement.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
    //             expectedFileName: 'draft-statement-of-common-ground.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
    //             expectedFileName: 'letter-confirming-planning-application.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: [
    //                 '0 Inspector File',
    //                 "01 Appelant's Initial Documents",
    //                 '02 Statement and appendicies'
    //             ],
    //             expectedFileName: 'ownership-certificate-and-agricultural-land-declaration.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
    //             expectedFileName: 'letter-confirming-planning-obligation.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: [
    //                 '0 Inspector File',
    //                 "01 Appelant's Initial Documents",
    //                 '05 Plans',
    //                 '02 Plans submitted after LPA decision'
    //             ],
    //             expectedFileName: 'plans-drawings.jpeg'
    //         },
    //         {
    //             expectedFolderHierarchy: ['0 Inspector File', '07 Planning Obligation'],
    //             expectedFileName: 'draft-planning-obligation.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: ['1 Main Party', 'Appellant/Agent/Applicant'],
    //             expectedFileName: 'other-supporting-documents.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: [
    //                 '0 Inspector File',
    //                 '05 Final comments',
    //                 'Appellant final comments'
    //             ],
    //             expectedFileName: 'final-comments.pdf'
    //         }
            
    //     ]
    //  },
    //  {
    //     statusOfOriginalApplication: 'refused',
    //     typeOfDecisionRequested: 'hearing',
    //     statusOfPlanningObligation: 'in draft',
    //     typeOfPlanningApplication: 'answer-full-appeal',
    //     applicationForm: {
    //         isAppellant: true,
    //         areaUnits:'hectare',
    //         appellantInGreenBelt: false,
    //         isOwnsAllLand: false,
    //         isOwnsSomeLand: true,
    //         knowsAllOwners: 'yes',
    //         knowsOtherOwners:'yes',
    //         isAgriculturalHolding: true,
    //         isTenantAgricultureHolding : true,
    //         anyOtherTenants : true,
    //         isInspectorNeedAccess : true				
    //     },
    //     finalComments: {
    //         check: false, // TODO: set these to true after feature flag introduced
    //         uploadAdditionalDocuments: false
    //     },
    //     expectedFilesAndFoldersInHorizon: [
    //         {
    //             expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
    //             expectedFileName: 'planning-application-form.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: [
    //                 '0 Inspector File',
    //                 "01 Appelant's Initial Documents",
    //                 '05 Plans',
    //                 '01 Application Plans'
    //             ],
    //             expectedFileName: 'plans-drawings-and-supporting-documents.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
    //             expectedFileName: 'design-and-access-statement.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
    //             expectedFileName: 'draft-statement-of-common-ground.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
    //             expectedFileName: 'letter-confirming-planning-application.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: [
    //                 '0 Inspector File',
    //                 "01 Appelant's Initial Documents",
    //                 '02 Statement and appendicies'
    //             ],
    //             expectedFileName: 'ownership-certificate-and-agricultural-land-declaration.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
    //             expectedFileName: 'letter-confirming-planning-obligation.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: [
    //                 '0 Inspector File',
    //                 "01 Appelant's Initial Documents",
    //                 '05 Plans',
    //                 '02 Plans submitted after LPA decision'
    //             ],
    //             expectedFileName: 'plans-drawings.jpeg'
    //         },
    //         {
    //             expectedFolderHierarchy: ['0 Inspector File', '07 Planning Obligation'],
    //             expectedFileName: 'draft-planning-obligation.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: ['1 Main Party', 'Appellant/Agent/Applicant'],
    //             expectedFileName: 'other-supporting-documents.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: [
    //                 '0 Inspector File',
    //                 '05 Final comments',
    //                 'Appellant final comments'
    //             ],
    //             expectedFileName: 'final-comments.pdf'
    //         }
            
    //     ]
    //  },
    //  {
    //     statusOfOriginalApplication: 'refused',
    //     typeOfDecisionRequested: 'hearing',
    //     statusOfPlanningObligation: 'in draft',
    //     typeOfPlanningApplication: 'answer-full-appeal',
    //     applicationForm: {
    //         isAppellant: true,
    //         areaUnits:'hectare',
    //         appellantInGreenBelt: false,
    //         isOwnsAllLand: false,
    //         isOwnsSomeLand: true,
    //         knowsAllOwners: 'some',
    //         knowsOtherOwners:'yes',
    //         isAgriculturalHolding: true,
    //         isTenantAgricultureHolding : true,
    //         anyOtherTenants : true,
    //         isInspectorNeedAccess : true				
    //     },
    //     finalComments: {
    //         check: false, // TODO: set these to true after feature flag introduced
    //         uploadAdditionalDocuments: false
    //     },
    //     expectedFilesAndFoldersInHorizon: [
    //         {
    //             expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
    //             expectedFileName: 'planning-application-form.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: [
    //                 '0 Inspector File',
    //                 "01 Appelant's Initial Documents",
    //                 '05 Plans',
    //                 '01 Application Plans'
    //             ],
    //             expectedFileName: 'plans-drawings-and-supporting-documents.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
    //             expectedFileName: 'design-and-access-statement.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
    //             expectedFileName: 'draft-statement-of-common-ground.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
    //             expectedFileName: 'letter-confirming-planning-application.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: [
    //                 '0 Inspector File',
    //                 "01 Appelant's Initial Documents",
    //                 '02 Statement and appendicies'
    //             ],
    //             expectedFileName: 'ownership-certificate-and-agricultural-land-declaration.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
    //             expectedFileName: 'letter-confirming-planning-obligation.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: [
    //                 '0 Inspector File',
    //                 "01 Appelant's Initial Documents",
    //                 '05 Plans',
    //                 '02 Plans submitted after LPA decision'
    //             ],
    //             expectedFileName: 'plans-drawings.jpeg'
    //         },
    //         {
    //             expectedFolderHierarchy: ['0 Inspector File', '07 Planning Obligation'],
    //             expectedFileName: 'draft-planning-obligation.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: ['1 Main Party', 'Appellant/Agent/Applicant'],
    //             expectedFileName: 'other-supporting-documents.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: [
    //                 '0 Inspector File',
    //                 '05 Final comments',
    //                 'Appellant final comments'
    //             ],
    //             expectedFileName: 'final-comments.pdf'
    //         }
            
    //     ]
    //  },
    //  {
    //     statusOfOriginalApplication: 'refused',
    //     typeOfDecisionRequested: 'hearing',
    //     statusOfPlanningObligation: 'in draft',
    //     typeOfPlanningApplication: 'answer-full-appeal',
    //     applicationForm: {
    //         isAppellant: true,
    //         areaUnits:'hectare',
    //         appellantInGreenBelt: false,
    //         isOwnsAllLand: false,
    //         isOwnsSomeLand: true,
    //         knowsAllOwners: 'no',
    //         knowsOtherOwners:'yes',
    //         isAgriculturalHolding: true,
    //         isTenantAgricultureHolding : true,
    //         anyOtherTenants : true,
    //         isInspectorNeedAccess : true				
    //     },
    //     finalComments: {
    //         check: false, // TODO: set these to true after feature flag introduced
    //         uploadAdditionalDocuments: false
    //     },
    //     expectedFilesAndFoldersInHorizon: [
    //         {
    //             expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
    //             expectedFileName: 'planning-application-form.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: [
    //                 '0 Inspector File',
    //                 "01 Appelant's Initial Documents",
    //                 '05 Plans',
    //                 '01 Application Plans'
    //             ],
    //             expectedFileName: 'plans-drawings-and-supporting-documents.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
    //             expectedFileName: 'design-and-access-statement.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
    //             expectedFileName: 'draft-statement-of-common-ground.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
    //             expectedFileName: 'letter-confirming-planning-application.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: [
    //                 '0 Inspector File',
    //                 "01 Appelant's Initial Documents",
    //                 '02 Statement and appendicies'
    //             ],
    //             expectedFileName: 'ownership-certificate-and-agricultural-land-declaration.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
    //             expectedFileName: 'letter-confirming-planning-obligation.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: [
    //                 '0 Inspector File',
    //                 "01 Appelant's Initial Documents",
    //                 '05 Plans',
    //                 '02 Plans submitted after LPA decision'
    //             ],
    //             expectedFileName: 'plans-drawings.jpeg'
    //         },
    //         {
    //             expectedFolderHierarchy: ['0 Inspector File', '07 Planning Obligation'],
    //             expectedFileName: 'draft-planning-obligation.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: ['1 Main Party', 'Appellant/Agent/Applicant'],
    //             expectedFileName: 'other-supporting-documents.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: [
    //                 '0 Inspector File',
    //                 '05 Final comments',
    //                 'Appellant final comments'
    //             ],
    //             expectedFileName: 'final-comments.pdf'
    //         }
            
    //     ]
    //  },

    //  {
    //     statusOfOriginalApplication: 'refused',
    //     typeOfDecisionRequested: 'hearing',
    //     statusOfPlanningObligation: 'in draft',
    //     typeOfPlanningApplication: 'answer-full-appeal',
    //     applicationForm: {
    //         isAppellant: false,
    //         areaUnits:'hectare',
    //         appellantInGreenBelt: true,
    //         isOwnsAllLand: false,
    //         isOwnsSomeLand: true,
    //         knowsAllOwners: 'no',
    //         knowsOtherOwners:'yes',
    //         isAgriculturalHolding: true,
    //         isTenantAgricultureHolding : true,
    //         anyOtherTenants : true,
    //         isInspectorNeedAccess : true				
    //     },
    //     finalComments: {
    //         check: false, // TODO: set these to true after feature flag introduced
    //         uploadAdditionalDocuments: false
    //     },
    //     expectedFilesAndFoldersInHorizon: [
    //         {
    //             expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
    //             expectedFileName: 'planning-application-form.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: [
    //                 '0 Inspector File',
    //                 "01 Appelant's Initial Documents",
    //                 '05 Plans',
    //                 '01 Application Plans'
    //             ],
    //             expectedFileName: 'plans-drawings-and-supporting-documents.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
    //             expectedFileName: 'design-and-access-statement.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
    //             expectedFileName: 'draft-statement-of-common-ground.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
    //             expectedFileName: 'letter-confirming-planning-application.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: [
    //                 '0 Inspector File',
    //                 "01 Appelant's Initial Documents",
    //                 '02 Statement and appendicies'
    //             ],
    //             expectedFileName: 'ownership-certificate-and-agricultural-land-declaration.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
    //             expectedFileName: 'letter-confirming-planning-obligation.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: [
    //                 '0 Inspector File',
    //                 "01 Appelant's Initial Documents",
    //                 '05 Plans',
    //                 '02 Plans submitted after LPA decision'
    //             ],
    //             expectedFileName: 'plans-drawings.jpeg'
    //         },
    //         {
    //             expectedFolderHierarchy: ['0 Inspector File', '07 Planning Obligation'],
    //             expectedFileName: 'draft-planning-obligation.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: ['1 Main Party', 'Appellant/Agent/Applicant'],
    //             expectedFileName: 'other-supporting-documents.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: [
    //                 '0 Inspector File',
    //                 '05 Final comments',
    //                 'Appellant final comments'
    //             ],
    //             expectedFileName: 'final-comments.pdf'
    //         }
            
    //     ]
    //  },
    // {
    //     statusOfOriginalApplication: 'refused',
    //     typeOfDecisionRequested: 'hearing',
    //     statusOfPlanningObligation: 'in draft',
    //     typeOfPlanningApplication: 'answer-full-appeal',
    //     applicationForm: {
    //         isAppellant: false,
    //         areaUnits:'hectare',
    //         appellantInGreenBelt: false,
    //         isOwnsAllLand: false,
    //         isOwnsSomeLand: false,
    //         knowsAllOwners: 'no',
    //         knowsOtherOwners:'yes',
    //         isAgriculturalHolding: true,
    //         isTenantAgricultureHolding : true,
    //         anyOtherTenants : true,
    //         isInspectorNeedAccess : true				
    //     },
    //     finalComments: {
    //         check: false, // TODO: set these to true after feature flag introduced
    //         uploadAdditionalDocuments: false
    //     },
    //     expectedFilesAndFoldersInHorizon: [
    //         {
    //             expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
    //             expectedFileName: 'planning-application-form.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: [
    //                 '0 Inspector File',
    //                 "01 Appelant's Initial Documents",
    //                 '05 Plans',
    //                 '01 Application Plans'
    //             ],
    //             expectedFileName: 'plans-drawings-and-supporting-documents.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
    //             expectedFileName: 'design-and-access-statement.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
    //             expectedFileName: 'draft-statement-of-common-ground.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
    //             expectedFileName: 'letter-confirming-planning-application.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: [
    //                 '0 Inspector File',
    //                 "01 Appelant's Initial Documents",
    //                 '02 Statement and appendicies'
    //             ],
    //             expectedFileName: 'ownership-certificate-and-agricultural-land-declaration.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
    //             expectedFileName: 'letter-confirming-planning-obligation.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: [
    //                 '0 Inspector File',
    //                 "01 Appelant's Initial Documents",
    //                 '05 Plans',
    //                 '02 Plans submitted after LPA decision'
    //             ],
    //             expectedFileName: 'plans-drawings.jpeg'
    //         },
    //         {
    //             expectedFolderHierarchy: ['0 Inspector File', '07 Planning Obligation'],
    //             expectedFileName: 'draft-planning-obligation.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: ['1 Main Party', 'Appellant/Agent/Applicant'],
    //             expectedFileName: 'other-supporting-documents.pdf'
    //         },
    //         {
    //             expectedFolderHierarchy: [
    //                 '0 Inspector File',
    //                 '05 Final comments',
    //                 'Appellant final comments'
    //             ],
    //             expectedFileName: 'final-comments.pdf'
    //         }
            
    //     ]
    // },
    
]