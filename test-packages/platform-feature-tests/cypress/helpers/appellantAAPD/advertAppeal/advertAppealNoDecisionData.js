const documents = {
    uploadAppealStmt: 'appeal-statement-valid.pdf',
    uploadApplicationForAppealCost: 'other-supporting-docs.pdf',
    uploadPlanningApplConfirmLetter: 'letter-confirming-planning-application.pdf',
    uploadDevelopmentDescription: 'additional-final-comments-1.pdf',
    uploadPlansDrawingAndSupportingDocs: 'plans-drawings-and-supporting-documents.pdf',
};

export const advertAppealNoDecisionTestCases = [
    {
        statusOfOriginalApplication: 'no decision',
        typeOfDecisionRequested: 'written',
        statusOfPlanningObligation: 'not started',
        typeOfPlanningApplication: 'answer-minor-commercial-advertisment',
        endToEndIntegration: true,
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
        statusOfOriginalApplication: 'no decision',
        typeOfDecisionRequested: 'written',
        statusOfPlanningObligation: 'not started',
        typeOfPlanningApplication: 'answer-minor-commercial-advertisment',
        endToEndIntegration: false,

        applicationForm: {
            isAppellant: true,
            isHighwayLand: true,
            isAdvertisementPosition: true,
            appellantInGreenBelt: false,
            isOwnsAllLand: false,
            isOwnsSomeLand: false,
            knowsAllOwners: 'yes',
            isLandownerPermission: true,
            isInspectorNeedAccess: true,
            isAppellantSiteSafety: true,
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
