const documents = {    
    uploadProofEvidence: 'upload-proof-evidence.pdf', 
    uploadWitnessesEvidence: 'witnesses-evidence.pdf',    
    uploadFileGreaterThan25mb:'greater-than-25-mb.docx',
    uploadWrongFormatFile: 'wrongFormatFile.xps',
    uploadEmergingPlan: 'emerging-plan.pdf',
    uploadOtherPolicies: 'other-policies.pdf',
    uploadSupplementaryPlanningDocs: 'supplementary-planning-docs.pdf',
    uploadCommunityInfrastructureLevy: 'community-infrastructure-levy.pdf'

};

export const appellantFullAppealProofsOfEvidenceTestCases = [
    {  
        proofsOfEvidence:{
            isAddWitness: true
        },
        documents,
    },
    {  
        proofsOfEvidence:{
            isAddWitness: false
        },
        documents,
    }
];