const documents = {
    uploadStatement: 'upload-proof-evidence.pdf',
    uploadWitnessesStatement: 'witnesses-evidence.pdf'

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