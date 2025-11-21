const documents = {
    uploadAppealStmt: 'appeal-statement-valid.pdf',
    uploadApplicationForAppealCost: 'other-supporting-docs.pdf',
    uploadDecisionLetter: 'decision-letter.pdf',
    uploadPlanningApplConfirmLetter: 'letter-confirming-planning-application.pdf',
    uploadDevelopmentDescription: 'additional-final-comments-1.pdf',
    uploadPlansDrawingAndSupportingDocs: 'plans-drawings-and-supporting-documents.pdf',
};

// Commercial Advert appeal test cases 
export const casAdvertAppealRefusedTestCases = [
    {
        statusOfOriginalApplication: 'refused',
        typeOfDecisionRequested: 'written',
        statusOfPlanningObligation: 'in draft',
        typeOfPlanningApplication: 'answer-minor-commercial-advertisment',
        applicationForm: {
            isAppellant: true,
            isHighwayLand: true,
            isAdvertisementPosition: true,
            appellantInGreenBelt: true,
            isOwnsAllLand: false,
            isOwnsSomeLand: true,
            knowsOtherOwners: 'yes',
            isLandownerPermission: true,
            isInspectorNeedAccess: true,
            isAppellantSiteSafety: true,
            iaUpdateDevelopmentDescription: true,
            anyOtherAppeals: true,
        },
        uploadDocuments: {
            isApplyAwardCost: true,
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
        typeOfDecisionRequested: 'written',
        statusOfPlanningObligation: 'in draft',
        typeOfPlanningApplication: 'answer-minor-commercial-advertisment',
        applicationForm: {
            isAppellant: false,
            isHighwayLand: false,
            isAdvertisementPosition: false,
            appellantInGreenBelt: false,
            isOwnsAllLand: false,
            isOwnsSomeLand: true,
            knowsOtherOwners: 'some',
            isLandownerPermission: false,
            isInspectorNeedAccess: false,
            isAppellantSiteSafety: false,
            iaUpdateDevelopmentDescription: false,
            anyOtherAppeals: false,
        },
        uploadDocuments: {
            isApplyAwardCost: false,
        },
        documents,
    },
    {
        statusOfOriginalApplication: 'refused',
        typeOfDecisionRequested: 'written',
        statusOfPlanningObligation: 'in draft',
        typeOfPlanningApplication: 'answer-minor-commercial-advertisment',
        applicationForm: {
            isAppellant: false,
            isHighwayLand: true,
            isAdvertisementPosition: false,
            appellantInGreenBelt: true,
            isOwnsAllLand: false,
            isOwnsSomeLand: true,
            knowsOtherOwners: 'no',
            isInspectorNeedAccess: true,
            isAppellantSiteSafety: false,
            iaUpdateDevelopmentDescription: true,
            anyOtherAppeals: true,
        },
        uploadDocuments: {

            isApplyAwardCost: true,
        },
        documents,
        otherAppeals: [{
            appealReferenceNumber: '1234567'
        }],
    },
    {
        statusOfOriginalApplication: 'refused',
        typeOfDecisionRequested: 'written',
        statusOfPlanningObligation: 'in draft',
        typeOfPlanningApplication: 'answer-minor-commercial-advertisment',
        applicationForm: {
            isAppellant: false,
            isHighwayLand: true,
            isAdvertisementPosition: false,
            appellantInGreenBelt: true,
            isOwnsAllLand: false,
            isOwnsSomeLand: false,
            knowsAllOwners: 'yes',
            isInspectorNeedAccess: true,
            isAppellantSiteSafety: false,
            iaUpdateDevelopmentDescription: true,
            anyOtherAppeals: true,
        },
        uploadDocuments: {
            isApplyAwardCost: true,
        },
        documents,
        otherAppeals: [{
            appealReferenceNumber: '1234567'
        }],
    },
    {
        statusOfOriginalApplication: 'refused',
        typeOfDecisionRequested: 'written',
        statusOfPlanningObligation: 'in draft',
        typeOfPlanningApplication: 'answer-minor-commercial-advertisment',
        applicationForm: {
            isAppellant: false,
            isHighwayLand: false,
            isAdvertisementPosition: false,
            appellantInGreenBelt: false,
            isOwnsAllLand: false,
            isOwnsSomeLand: false,
            knowsAllOwners: 'some',
            isLandownerPermission: true,
            isInspectorNeedAccess: false,
            isAppellantSiteSafety: false,
            iaUpdateDevelopmentDescription: false,
            anyOtherAppeals: false,
        },
        uploadDocuments: {
            isApplyAwardCost: false,
        },
        documents,
    },
    {
        statusOfOriginalApplication: 'refused',
        typeOfDecisionRequested: 'written',
        statusOfPlanningObligation: 'in draft',
        typeOfPlanningApplication: 'answer-minor-commercial-advertisment',
        applicationForm: {
            isAppellant: false,
            isHighwayLand: true,
            isAdvertisementPosition: false,
            appellantInGreenBelt: true,
            isOwnsAllLand: false,
            isOwnsSomeLand: false,
            knowsAllOwners: 'no',
            isInspectorNeedAccess: true,
            isAppellantSiteSafety: false,
            iaUpdateDevelopmentDescription: true,
            anyOtherAppeals: true,
        },
        uploadDocuments: {

            isApplyAwardCost: true,
        },
        documents,
        otherAppeals: [{
            appealReferenceNumber: '1234567'
        }],
    }
];
