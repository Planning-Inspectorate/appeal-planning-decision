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
        appealType:"Plannig",
        additionalDocument: {
            selectAnswer: false
        },
        documents,
    },
    {
        appealType:"Planning",
        additionalDocument: {
            selectAnswer: true
        },
        documents,
    },
    {
        appealType:"Enforcement notice",
        additionalDocument: {
            selectAnswer: false
        },
        documents,
    },
    {
        appealType:"Enforcement notice",
        additionalDocument: {
            selectAnswer: true
        },
        documents,
    },
    {
        appealType:"Lawful development certificate",
        additionalDocument: {
            selectAnswer: false
        },
        documents,
    },
    {
        appealType:"Lawful development certificate",
        additionalDocument: {
            selectAnswer: true
        },
        documents,
    },
    {
        appealType:"Advertisement",
        additionalDocument: {
            selectAnswer: false
        },
        documents,
    },
    {
        appealType:"Advertisement",
        additionalDocument: {
            selectAnswer: true
        },
        documents,
    },    
    {
        appealType:"Enforcement listed building and conservation area",
        additionalDocument: {
            selectAnswer: false
        },
        documents,
    },
    {
        appealType:"Enforcement listed building and conservation area",
        additionalDocument: {
            selectAnswer: true
        },
        documents,
    }
];