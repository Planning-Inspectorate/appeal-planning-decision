const documents = {
    uploadStatement: 'upload-statement.pdf',
    uploadFileGreaterThan25mb: 'greater-than-25-mb.docx',
    uploadWrongFormatFile: 'wrongFormatFile.xps',
    uploadEmergingPlan: 'emerging-plan.pdf',
    uploadOtherPolicies: 'other-policies.pdf',
    uploadSupplementaryPlanningDocs: 'supplementary-planning-docs.pdf',
    uploadCommunityInfrastructureLevy: 'community-infrastructure-levy.pdf'
};

export const statementTestCases = [
    {
        additionalDocument: {
            selectAnswer: false
        },
        documents,
    },
    {
        additionalDocument: {
            selectAnswer: true
        },
        documents,
    }
];