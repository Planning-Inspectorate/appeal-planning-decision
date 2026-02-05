
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
export const ldcAppealRefusedTestCases = [
    {
        statusOfOriginalApplication: 'refused',
        typeOfDecisionRequested: 'written',
        statusOfPlanningObligation: 'in draft',
        typeOfPlanningApplication: 'answer-lawful-development-certificate',
        isListedBuilding: true,
        endToEndIntegration: false,
        applicationForm: {
            isAppellant: false,
            appellantInGreenBelt: false,
            isInspectorNeedAccess: false,
            isAppellantSiteSafety: false,
            iaUpdateDevelopmentDescription: false,
            appellantProcedurePreference: 'written',
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
        statusOfOriginalApplication: 'refused',
        typeOfDecisionRequested: 'inquiry',
        statusOfPlanningObligation: 'in draft',
        typeOfPlanningApplication: 'answer-lawful-development-certificate',
        isListedBuilding: true,
        applicationForm: {
            isAppellant: true,
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
    },
    {
        statusOfOriginalApplication: 'refused',
        typeOfDecisionRequested: 'hearing',
        statusOfPlanningObligation: 'in draft',
        typeOfPlanningApplication: 'answer-lawful-development-certificate',
        isListedBuilding: true,
        applicationForm: {
            isAppellant: true,
            appellantInGreenBelt: false,
            isInspectorNeedAccess: false,
            isAppellantSiteSafety: false,
            iaUpdateDevelopmentDescription: true,
            appellantProcedurePreference: 'hearing',
            ldcType: 'existing-development',
            anyOtherAppeals: true,
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
        otherAppeals: [{
            appealReferenceNumber: '1234567'
        }, {
            appealReferenceNumber: '7654321'
        }],
    }
]