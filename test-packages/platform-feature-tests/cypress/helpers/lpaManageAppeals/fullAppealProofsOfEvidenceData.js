const documents = {    
    uploadProofEvidence: 'upload-proof-evidence.pdf', 
    uploadWitnessesEvidence: 'witnesses-evidence.pdf'

};

export const fullAppealProofsOfEvidenceTestCases = [
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