const documents = {
    uploadAppealStmt: 'appeal-statement-valid.pdf',
    uploadApplicationForAppealCost: 'other-supporting-docs.pdf',
    uploadNewPlanOrDrawing: 'plans-drawings.jpeg',
    uploadOtherNewSupportDoc: 'other-supporting-docs.pdf',
    uploadSeparateOwnershipCertAndAgricultureDoc: 'draft-planning-obligation.pdf',
    uploadDesignAndAccessStmt: 'design-and-access-statement.pdf',
    uploadPlansDrawingAndSupportingDocs: 'plans-drawings-and-supporting-documents.pdf',
    uploadFinalisingDocReady: 'additional-final-comments-2.pdf',
    uploadFinalisingDocDraft: 'additional-final-comments-2.pdf',
    uploadDevelopmentDescription: 'additional-final-comments-1.pdf',
    uploadDecisionLetter: 'decision-letter.pdf',
    uploadPlanningApplConfirmLetter: 'letter-confirming-planning-application.pdf',
    uploadDraftStatementOfCommonGround: 'draft-statement-of-common-ground.pdf'
};

export const removalVariationConditionNoDecisionTestCases = [
    {
        tags: ['smoke'],
        statusOfOriginalApplication: 'no decision',
        isListedBuilding: true,
        typeOfDecisionRequested: 'written',
        statusOfPlanningObligation: 'in draft',
        typeOfPlanningApplication: 'answer-removal-or-variation-of-conditions',
        endToEndIntegration: true,
        applicationForm: {
            isAppellant: true,
            areaUnits: 'hectare',
            appellantInGreenBelt: true,
            isOwnsAllLand: false,
            isOwnsSomeLand: true,
            knowsOtherOwners: 'yes',
            isAgriculturalHolding: false,
            majorMionorDevelopmentData: 'major',
            applicationAboutData: 'householder',
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
        otherAppeals: [{ appealReferenceNumber: '1234567' }, { appealReferenceNumber: '7654321' }],
        finalComments: { check: false, uploadAdditionalDocuments: false }
    },
    {
        tags: ['smoke'],
        statusOfOriginalApplication: 'no decision',
        isListedBuilding: false,
        typeOfDecisionRequested: 'written',
        statusOfPlanningObligation: 'in draft',
        typeOfPlanningApplication: 'answer-removal-or-variation-of-conditions',
        endToEndIntegration: true,
        applicationForm: {
            isAppellant: true,
            areaUnits: 'hectare',
            appellantInGreenBelt: true,
            isOwnsAllLand: false,
            isOwnsSomeLand: true,
            knowsOtherOwners: 'yes',
            isAgriculturalHolding: false,
            majorMionorDevelopmentData: 'major',
            applicationAboutData: 'householder',
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
        otherAppeals: [{ appealReferenceNumber: '1234567' }, { appealReferenceNumber: '7654321' }],
        finalComments: { check: false, uploadAdditionalDocuments: false }
    }
];