
export const submitFullAppealData = 	[
    {
        statusOfOriginalApplication: 'refused',
        typeOfDecisionRequested: 'inquiry',
        statusOfPlanningObligation: 'in draft',
        typeOfPlanningApplication: 'answer-full-appeal',
        applicationForm: {
            isAppellant: true,
            areaUnits:'hectare',
            appellantInGreenBelt: false,
            isOwnsAllLand: false,
            isOwnsSomeLand: true,
            knowsAllOwners: 'no',
            knowsOtherOwners: 'yes',
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
            isApplyAwardCost: true,
            isSubmitDesignAndAccessStmt: true,
            isNewPlanOrDrawingAvailable: true,
            isOtherNewDocumentAvailable: true
        },
        otherAppeals: [{
            appealReferenceNumber: '1234567'
        }, {
            appealReferenceNumber: '7654321'
        }],
        finalComments: {
            check: false, // TODO: set these to true after feature flag introduced
            uploadAdditionalDocuments: false
        },
        expectedFilesAndFoldersInHorizon: [
            {
                expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
                expectedFileName: 'planning-application-form.pdf'
            },
            {
                expectedFolderHierarchy: [
                    '0 Inspector File',
                    "01 Appelant's Initial Documents",
                    '05 Plans',
                    '01 Application Plans'
                ],
                expectedFileName: 'plans-drawings-and-supporting-documents.pdf'
            },
            {
                expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
                expectedFileName: 'design-and-access-statement.pdf'
            },
            {
                expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
                expectedFileName: 'draft-statement-of-common-ground.pdf'
            },
            {
                expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
                expectedFileName: 'letter-confirming-planning-application.pdf'
            },
            {
                expectedFolderHierarchy: [
                    '0 Inspector File',
                    "01 Appelant's Initial Documents",
                    '02 Statement and appendicies'
                ],
                expectedFileName: 'ownership-certificate-and-agricultural-land-declaration.pdf'
            },
            {
                expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
                expectedFileName: 'letter-confirming-planning-obligation.pdf'
            },
            {
                expectedFolderHierarchy: [
                    '0 Inspector File',
                    "01 Appelant's Initial Documents",
                    '05 Plans',
                    '02 Plans submitted after LPA decision'
                ],
                expectedFileName: 'plans-drawings.jpeg'
            },
            {
                expectedFolderHierarchy: ['0 Inspector File', '07 Planning Obligation'],
                expectedFileName: 'draft-planning-obligation.pdf'
            },
            {
                expectedFolderHierarchy: ['1 Main Party', 'Appellant/Agent/Applicant'],
                expectedFileName: 'other-supporting-documents.pdf'
            },
            {
                expectedFolderHierarchy: [
                    '0 Inspector File',
                    '05 Final comments',
                    'Appellant final comments'
                ],
                expectedFileName: 'final-comments.pdf'
            }
            
        ]
     },
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