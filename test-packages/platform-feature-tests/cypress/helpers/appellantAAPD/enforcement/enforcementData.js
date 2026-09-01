const documents = {
    uploadPriorCorrespondence: 'other-supporting-docs.pdf',
    uploadEnforcementNotice: 'other-supporting-docs.pdf',
    uploadEnforcementNoticePlan: 'other-supporting-docs.pdf',
    uploadApplicationForAppealCost: 'other-supporting-docs.pdf',
    uploadOtherNewSupportDoc: 'other-supporting-docs.pdf',
    uploadGroundSupportingDoc_a: 'other-supporting-docs.pdf',
    uploadGroundSupportingDoc_d: 'other-supporting-docs.pdf',
    uploadGroundSupportingDoc_g: 'other-supporting-docs.pdf',
};

const getRelativeDate = (daysFromToday) => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + daysFromToday);

    return {
        day: String(date.getDate()),
        month: String(date.getMonth() + 1),
        year: String(date.getFullYear())
    };
};

const issueDate = getRelativeDate(-7);
const futureEffectiveDate = getRelativeDate(7);
const pastEffectiveDate = getRelativeDate(-1);
const contactedPlanningInspectorateDate = getRelativeDate(-2);

export const enforcementAppealTestCases = [
    // Test case 1: Enforcement notice, written procedure
    {
        tags: ['smoke'],
        statusOfOriginalApplication: 'enforcement',
        typeOfDecisionRequested: 'written',
        typeOfPlanningApplication: 'answer-enforcement',
        isListedBuilding: false,
        endToEndIntegration: false,
        enforcementNotice: {
            issueDate,
            effectiveDate: futureEffectiveDate,
            referenceNumber: '1234567',
            contactedPlanningInspectorate: true,
            contactedPlanningInspectorateDate
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
    // Test case 2: Enforcement notice about a listed building, inquiry procedure
    {
        tags: ['smoke'],
        statusOfOriginalApplication: 'enforcement',
        typeOfDecisionRequested: 'inquiry',
        typeOfPlanningApplication: 'answer-enforcement',
        isListedBuilding: true,
        endToEndIntegration: false,
        enforcementNotice: {
            issueDate,
            effectiveDate: pastEffectiveDate,
            referenceNumber: '1234567',
            contactedPlanningInspectorate: true,
            contactedPlanningInspectorateDate
        },
        applicationForm: {
            isAppellant: false,
            appellantType: 'organisation',
            isInspectorNeedAccess: false,
            isAppellantSiteSafety: true,
            appellantProcedurePreference: 'inquiry',
            isSiteAddressContactAddress: true,
            interestInLand: 'other',
            hasPermissionToUseLand: true,
            groundsOfAppeal: ['e', 'f', 'g'],
            groundsSupportingDocuments: { e: false, f: false, g: true },
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
    // Test case 3: Enforcement notice about a listed building, hearing procedure
    {
        statusOfOriginalApplication: 'enforcement',
        typeOfDecisionRequested: 'hearing',
        typeOfPlanningApplication: 'answer-enforcement',
        isListedBuilding: true,
        endToEndIntegration: false,
        enforcementNotice: {
            issueDate,
            effectiveDate: futureEffectiveDate,
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

    // Test case 4: Enforcement notice, individual appealing on behalf of the appellant, written procedure
    {
        statusOfOriginalApplication: 'enforcement',
        typeOfDecisionRequested: 'written',
        typeOfPlanningApplication: 'answer-enforcement',
        isListedBuilding: false,
        endToEndIntegration: false,
        enforcementNotice: {
            issueDate,
            effectiveDate: futureEffectiveDate,
            referenceNumber: '1234567',
            contactedPlanningInspectorate: false
        },
        applicationForm: {
            isAppellant: false,
            appellantType: 'individual',
            isInspectorNeedAccess: true,
            isAppellantSiteSafety: true,
            appellantProcedurePreference: 'written',
            isSiteAddressContactAddress: true,
            interestInLand: 'mortgageLender',
            groundsOfAppeal: ['b', 'c'],
            groundsSupportingDocuments: { b: false, c: false },
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