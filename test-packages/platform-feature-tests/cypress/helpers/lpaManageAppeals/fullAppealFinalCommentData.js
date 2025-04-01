const documents = {    
    uploadStatement: 'upload-statement.pdf'
};

export const fullAppealFinalCommentTestCases = [
    {  
        submitFinalComments:{
            selectAnswer: false
        },
        documents,
    },
    {  
        submitFinalComments:{
            selectAnswer: true
        },
        documents,
    }
];