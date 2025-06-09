const documents = {   
    uploadWitnessesStatement: 'witnesses-evidence.pdf',
    uploadStatement: 'upload-statement.pdf',
    uploadFileGreaterThan25mb:'greater-than-25-mb.docx',
    uploadWrongFormatFile: 'wrongFormatFile.xps',
    uploadEmergingPlan: 'emerging-plan.pdf',
    uploadOtherPolicies: 'other-policies.pdf',
    uploadSupplementaryPlanningDocs: 'supplementary-planning-docs.pdf',
    uploadCommunityInfrastructureLevy: 'community-infrastructure-levy.pdf'
};

export const r6FullAppealsStatementTestCases = [
    {
        statement: {
            isAddWitness: true
        },
        documents,
    },
    {
        statement: {
            isAddWitness: false
        },
        documents,
    }
];