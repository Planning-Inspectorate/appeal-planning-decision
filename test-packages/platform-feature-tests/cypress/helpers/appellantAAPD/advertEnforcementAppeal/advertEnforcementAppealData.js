const documents = {
    uploadAppealStmt: 'appeal-statement-valid.pdf',
    uploadApplicationForAppealCost: 'other-supporting-docs.pdf',
    uploadDecisionLetter: 'decision-letter.pdf',
    uploadPlanningApplConfirmLetter: 'letter-confirming-planning-application.pdf',
    uploadDevelopmentDescription: 'additional-final-comments-1.pdf',
    uploadPlansDrawingAndSupportingDocs: 'plans-drawings-and-supporting-documents.pdf',
};

// Enforcement Advert appeal test case
export const advertAppealEnforcementTestCases = [
    {
        receivedEnforcementNotice: true,
        statusOfOriginalApplication: 'refused',
        typeOfDecisionRequested: 'written',
        statusOfPlanningObligation: 'in draft',
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
    }
];
