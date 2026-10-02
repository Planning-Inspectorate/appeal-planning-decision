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
    uploadDraftStatementOfCommonGround: 'draft-statement-of-common-ground.pdf',
    uploadPlanningObligation: 'planning-obligation.pdf',
    uploadEnvironmentalStmt: 'environmental-statement.pdf',
    uploadDescriptionOfDevelopment: 'description-of-development.pdf'
};

const otherAppeals = [{ appealReferenceNumber: '1234567' }, { appealReferenceNumber: '7654321' }];
const finalComments = { check: false, uploadAdditionalDocuments: false };

export const outlinePlanningRefusedTestCases = [
    {
        tags: ['smoke', 'expedited'],
        statusOfOriginalApplication: 'refused',
        typeOfDecisionRequested: 'written',
        statusOfPlanningObligation: 'in draft',
        typeOfPlanningApplication: 'answer-outline-planning',
        endToEndIntegration: true,
        expeditedAppeal: true,
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
        otherAppeals,
        finalComments
    },
    {
        tags: ['smoke'],
        statusOfOriginalApplication: 'refused',
        typeOfDecisionRequested: 'written',
        statusOfPlanningObligation: 'in draft',
        typeOfPlanningApplication: 'answer-outline-planning',
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
        otherAppeals,
        finalComments
    },
    ...['hearing', 'inquiry'].map((typeOfDecisionRequested) => ({
        statusOfOriginalApplication: 'refused',
        typeOfDecisionRequested,
        statusOfPlanningObligation: 'in draft',
        typeOfPlanningApplication: 'answer-outline-planning',
        applicationForm: {
            isAppellant: true,
            areaUnits: 'squaremeter',
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
            appellantProcedurePreference: typeOfDecisionRequested,
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
        otherAppeals,
        finalComments
    }))
];