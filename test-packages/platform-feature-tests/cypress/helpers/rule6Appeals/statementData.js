const documents = {   
    uploadWitnessesStatement: 'witnesses-evidence.pdf',
    uploadStatement: 'upload-statement.pdf',
    uploadFileGreaterThan50mb:'greater-than-50-mb.docx',
    uploadWrongFormatFile: 'wrongFormatFile.xps',
    uploadEmergingPlan: 'emerging-plan.pdf',
    uploadOtherPolicies: 'other-policies.pdf',
    uploadSupplementaryPlanningDocs: 'supplementary-planning-docs.pdf',
    uploadCommunityInfrastructureLevy: 'community-infrastructure-levy.pdf'
};

export const statementTestCases = [
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