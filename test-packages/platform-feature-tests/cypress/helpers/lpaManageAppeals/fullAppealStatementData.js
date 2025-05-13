const documents = {    
    uploadStatement: 'upload-statement.pdf'
};

export const fullAppealStatementTestCases = [
    {  
        additionalDocument:{
            selectAnswer: false
        },
        documents,
    },
    {  
        additionalDocument:{
            selectAnswer: true
        },
        documents,
    }
];