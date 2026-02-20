const documents = {
    uploadEnforcementNotice: 'enforcement-notice.pdf',
    uploadEnforcementNoticePlan: 'enforcement-notice-plan.pdf',
    uploadApplicationForAppealCost: 'other-supporting-docs.pdf',
    uploadOtherNewSupportDoc: 'other-supporting-docs.pdf',
    uploadGroundSupportingDoc_a: 'other-supporting-docs.pdf',
    uploadGroundSupportingDoc_d: 'other-supporting-docs.pdf',
    uploadGroundSupportingDoc_h: 'other-supporting-docs.pdf',
};

export const enforcementAppealTestCases = [
    // Test case 1: Enforcement notice, written procedure
    {
        statusOfOriginalApplication: 'enforcement',
        typeOfDecisionRequested: 'written',
        typeOfPlanningApplication: 'answer-enforcement',
        isListedBuilding: false,
        endToEndIntegration: false,
        enforcementNotice: {
            issueDate: { day: '2', month: '2', year: '2026' },
            effectiveDate: { day: '3', month: '3', year: '2026' },
            referenceNumber: '1234567',
            contactedPlanningInspectorate: true,
            contactedPlanningInspectorateDate: { day: '24', month: '1', year: '2026' }
        },
        applicationForm: {
            isAppellant: true,
            appellantType: 'individual',
            isInspectorNeedAccess: true,
            isAppellantSiteSafety: true,
            appellantProcedurePreference: 'written',
            isSiteAddressContactAddress: true,
            interestInLand: 'owner',
            groundsOfAppeal: ['a', 'b'],
            groundsSupportingDocuments: { a: true, b: false },
            anyOtherAppeals: true,
            isAppellantLinkedCaseAdd: true
        },
        uploadDocuments: {
            isApplyAwardCost: true,
            isOtherNewDocumentAvailable: true
        },
        documents,
        otherAppeals: [
            { appealReferenceNumber: '1234567' },
            { appealReferenceNumber: '7654321' }
        ]
    },
    // Test case 2: Enforcement notice about a listed building, hearing procedure
    {
        statusOfOriginalApplication: 'enforcement',
        typeOfDecisionRequested: 'hearing',
        typeOfPlanningApplication: 'answer-enforcement',
        isListedBuilding: true,
        endToEndIntegration: false,
        enforcementNotice: {
            issueDate: { day: '2', month: '2', year: '2026' },
            effectiveDate: { day: '3', month: '3', year: '2026' },
            referenceNumber: '1234567',
            contactedPlanningInspectorate: false
        },
        applicationForm: {
            isAppellant: false,
            appellantType: 'additional-appellants',
            isInspectorNeedAccess: true,
            isAppellantSiteSafety: true,
            appellantProcedurePreference: 'hearing',
            isSiteAddressContactAddress: true,
            interestInLand: 'tenant',
            groundsOfAppeal: ['c', 'd', 'e'],
            groundsSupportingDocuments: { c: false, d: true, e: false },
            anyOtherAppeals: true,
            isAppellantLinkedCaseAdd: true
        },
        uploadDocuments: {
            isApplyAwardCost: true,
            isOtherNewDocumentAvailable: true
        },
        documents,
        otherAppeals: [
            { appealReferenceNumber: '1234567' },
            { appealReferenceNumber: '7654321' }
        ]
    },
    // Test case 3: Enforcement notice about a listed building, inquiry procedure
    {
        statusOfOriginalApplication: 'enforcement',
        typeOfDecisionRequested: 'inquiry',
        typeOfPlanningApplication: 'answer-enforcement',
        isListedBuilding: true,
        endToEndIntegration: false,
        enforcementNotice: {
            issueDate: { day: '2', month: '2', year: '2026' },
            effectiveDate: { day: '3', month: '3', year: '2026' },
            referenceNumber: '1234567',
            contactedPlanningInspectorate: true,
            contactedPlanningInspectorateDate: { day: '10', month: '2', year: '2026' }
        },
        applicationForm: {
            isAppellant: false,
            appellantType: 'organisation',
            isInspectorNeedAccess: false,
            isAppellantSiteSafety: true,
            appellantProcedurePreference: 'inquiry',
            isSiteAddressContactAddress: true,
            interestInLand: 'other',
            groundsOfAppeal: ['f', 'g', 'h', 'i'],
            groundsSupportingDocuments: { f: false, g: false, h: true, i: false },
            anyOtherAppeals: true,
            isAppellantLinkedCaseAdd: true
        },
        uploadDocuments: {
            isApplyAwardCost: true,
            isOtherNewDocumentAvailable: true
        },
        documents,
        otherAppeals: [
            { appealReferenceNumber: '1234567' },
            { appealReferenceNumber: '7654321' }
        ]
    }
];