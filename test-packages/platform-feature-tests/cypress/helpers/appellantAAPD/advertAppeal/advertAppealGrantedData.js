const documents = {
    uploadAppealStmt: 'appeal-statement-valid.pdf',
    uploadApplicationForAppealCost: 'other-supporting-docs.pdf',
    uploadDecisionLetter: 'decision-letter.pdf',
    uploadDevelopmentDescription: 'additional-final-comments-1.pdf',
    uploadPlanningApplConfirmLetter: 'letter-confirming-planning-application.pdf',
    uploadPlansDrawingAndSupportingDocs: 'plans-drawings-and-supporting-documents.pdf',
};

// Granted Advert appeal test cases 
export const advertAppealGrantedTestCases = [
    {
        statusOfOriginalApplication: 'granted',
        typeOfDecisionRequested: 'written',
        statusOfPlanningObligation: 'not started',
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
            appellantProcedurePreference: 'written',
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
        statusOfOriginalApplication: 'granted',
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
            appellantProcedurePreference: 'written',
            anyOtherAppeals: false,
        },
        uploadDocuments: {
            isApplyAwardCost: true,
        },
        documents,
    },
    {
        statusOfOriginalApplication: 'granted',
        typeOfDecisionRequested: 'written',
        statusOfPlanningObligation: 'not started',
        typeOfPlanningApplication: 'answer-minor-commercial-advertisment',
        applicationForm: {
            isAppellant: false,
            isHighwayLand: true,
            isAdvertisementPosition: true,
            appellantInGreenBelt: true,
            isOwnsAllLand: false,
            isOwnsSomeLand: true,
            knowsOtherOwners: 'no',
            isInspectorNeedAccess: true,
            isAppellantSiteSafety: false,
            iaUpdateDevelopmentDescription: true,
            appellantProcedurePreference: 'written',
            anyOtherAppeals: true,
        },
        uploadDocuments: {
            isApplyAwardCost: true,
        },
        documents,
        otherAppeals: [{
            appealReferenceNumber: '1234567'
        }]
    },
    {
        statusOfOriginalApplication: 'granted',
        typeOfDecisionRequested: 'written',
        statusOfPlanningObligation: 'not started',
        typeOfPlanningApplication: 'answer-minor-commercial-advertisment',
        applicationForm: {
            isAppellant: false,
            isHighwayLand: true,
            isAdvertisementPosition: true,
            appellantInGreenBelt: true,
            isOwnsAllLand: false,
            isOwnsSomeLand: false,
            knowsAllOwners: 'yes',
            isLandownerPermission: true,
            isInspectorNeedAccess: true,
            isAppellantSiteSafety: false,
            iaUpdateDevelopmentDescription: true,
            appellantProcedurePreference: 'hearing',
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
        statusOfOriginalApplication: 'granted',
        typeOfDecisionRequested: 'written',
        statusOfPlanningObligation: 'not started',
        typeOfPlanningApplication: 'answer-minor-commercial-advertisment',
        applicationForm: {
            isAppellant: false,
            isHighwayLand: true,
            isAdvertisementPosition: true,
            appellantInGreenBelt: true,
            isOwnsAllLand: true,
            isInspectorNeedAccess: true,
            isAppellantSiteSafety: false,
            isUpdateDevelopmentDescription: true,
            appellantProcedurePreference: 'inquiry',
            anyOtherAppeals: false,
        },
        uploadDocuments: {
            isApplyAwardCost: true,

        },
        documents,
    }
    {
        statusOfOriginalApplication: 'granted',
        typeOfDecisionRequested: 'written',
        statusOfPlanningObligation: 'not started',
        typeOfPlanningApplication: 'answer-minor-commercial-advertisment',
        applicationForm: {
            isAppellant: false,
            isHighwayLand: true,
            isAdvertisementPosition: true,
            appellantInGreenBelt: true,
            isOwnsAllLand: false,
            isOwnsSomeLand: false,
            knowsAllOwners: 'some',
            isInspectorNeedAccess: true,
            isAppellantSiteSafety: false,
            isUpdateDevelopmentDescription: true,
            appellantProcedurePreference: 'written',
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
        statusOfOriginalApplication: 'granted',
        typeOfDecisionRequested: 'written',
        statusOfPlanningObligation: 'not started',
        typeOfPlanningApplication: 'answer-minor-commercial-advertisment',
        applicationForm: {
            isAppellant: false,
            isHighwayLand: true,
            isAdvertisementPosition: true,
            appellantInGreenBelt: true,
            isOwnsAllLand: false,
            isOwnsSomeLand: false,
            knowsAllOwners: 'no',
            isInspectorNeedAccess: true,
            isAppellantSiteSafety: false,
            iaUpdateDevelopmentDescription: true,
            appellantProcedurePreference: 'written',
            anyOtherAppeals: false,
        },
        uploadDocuments: {
            isApplyAwardCost: true,
        },
        documents,
    }
];


