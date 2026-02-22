
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
export const ldcAppealNoDecisionTestCases = [
    {
        tags: ['smoke'],
        statusOfOriginalApplication: 'no decision',
        typeOfDecisionRequested: 'written',
        statusOfPlanningObligation: 'in draft',
        typeOfPlanningApplication: 'answer-lawful-development-certificate',
        isListedBuilding: true,
        endToEndIntegration: false,
        applicationForm: {
            isAppellant: false,
            appellantInGreenBelt: true,
            isInspectorNeedAccess: true,
            isAppellantSiteSafety: true,
            iaUpdateDevelopmentDescription: true,
            appellantProcedurePreference: 'written',
            ldcType: 'proposed-use-of-a-development',
            anyOtherAppeals: true,
            isAppellantLinkedCaseAdd: true
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
    },
    {
        statusOfOriginalApplication: 'no decision',
        typeOfDecisionRequested: 'inquiry',
        statusOfPlanningObligation: 'in draft',
        typeOfPlanningApplication: 'answer-lawful-development-certificate',
        isListedBuilding: true,
        applicationForm: {
            isAppellant: true,
            appellantInGreenBelt: false,
            isInspectorNeedAccess: false,
            isAppellantSiteSafety: false,
            iaUpdateDevelopmentDescription: false,
            appellantProcedurePreference: 'inquiry',
            ldcType: 'proposed-changes-to-a-listed-building',
            anyOtherAppeals: false,
            isAppellantLinkedCaseAdd: false
        },
        uploadDocuments: {
            submitPlanningObligation: false,
            finalisedPlanningStatus: 'in draft',
            isApplyAwardCost: false,
            isNewPlanOrDrawingAvailable: false,
            isOtherNewDocumentAvailable: false
        },
        documents,
    },
    {
        statusOfOriginalApplication: 'no decision',
        typeOfDecisionRequested: 'hearing',
        statusOfPlanningObligation: 'in draft',
        typeOfPlanningApplication: 'answer-lawful-development-certificate',
        isListedBuilding: true,
        applicationForm: {
            isAppellant: true,
            appellantInGreenBelt: false,
            isInspectorNeedAccess: false,
            isAppellantSiteSafety: false,
            iaUpdateDevelopmentDescription: false,
            appellantProcedurePreference: 'hearing',
            ldcType: 'proposed-changes-to-a-listed-building',
            anyOtherAppeals: false,
            isAppellantLinkedCaseAdd: false
        },
        uploadDocuments: {
            submitPlanningObligation: false,
            finalisedPlanningStatus: 'in draft',
            isApplyAwardCost: false,
            isNewPlanOrDrawingAvailable: false,
            isOtherNewDocumentAvailable: false
        },
        documents,
    }
]