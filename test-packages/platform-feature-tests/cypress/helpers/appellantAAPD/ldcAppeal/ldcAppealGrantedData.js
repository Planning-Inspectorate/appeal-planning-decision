
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
export const ldcAppealGrantedTestCases = [
    // Test case 1: Original application granted, written procedure, existing-development S191
    {
        statusOfOriginalApplication: 'granted',
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
            appellantProcedurePreference: 'written',
            ldcType: 'existing-development',
            anyOtherAppeals: true,
            isAppellantLinkedCaseAdd: true
        },
        uploadDocuments: {
            submitPlanningObligation: true,
            finalisedPlanningStatus: 'ready',
            isApplyAwardCost: true,
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
    // Test case 2: Original application granted, hearing, proposed-use-of-a-development S192
    {
        statusOfOriginalApplication: 'granted',
        typeOfDecisionRequested: 'hearing',
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
            appellantProcedurePreference: 'hearing',
            ldcType: 'proposed-use-of-a-development',
            anyOtherAppeals: true,
            isAppellantLinkedCaseAdd: true
        },
        uploadDocuments: {
            submitPlanningObligation: true,
            finalisedPlanningStatus: 'ready',
            isApplyAwardCost: true,
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
    // Test case 3: Original application granted, Inquiry, proposed changes to a listed building S26H
    {
        statusOfOriginalApplication: 'granted',
        typeOfDecisionRequested: 'inquiry',
        statusOfPlanningObligation: 'in draft',
        typeOfPlanningApplication: 'answer-lawful-development-certificate',
        isListedBuilding: true,
        endToEndIntegration: false,
        applicationForm: {
            isAppellant: false,
            appellantInGreenBelt: true,
            isInspectorNeedAccess: false,
            isAppellantSiteSafety: true,
            iaUpdateDevelopmentDescription: true,
            appellantProcedurePreference: 'inquiry',
            ldcType: 'proposed-changes-to-a-listed-building',
            anyOtherAppeals: true,
            isAppellantLinkedCaseAdd: true
        },
        uploadDocuments: {
            submitPlanningObligation: true,
            finalisedPlanningStatus: 'ready',
            isApplyAwardCost: true,
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