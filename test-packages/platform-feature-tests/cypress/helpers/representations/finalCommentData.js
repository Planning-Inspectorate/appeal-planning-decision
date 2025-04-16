const documents = {    
    uploadSupportDocsFinalComments: 'upload-support-docs-final-comments.pdf',
    uploadAdditionalDocsSupportFinalComments: 'upload-additional-docs-support-final-comments.pdf'
};

export const finalCommentTestCases = [
    {  
        submitFinalComments:{
            selectAnswer: false,
        },
    },
    {  
        submitFinalComments:{
            selectAnswer: true,
        },
        additionalDocuments:{
            selectAnswer: true,
        },
        documents,
    },
    {  
        submitFinalComments:{
            selectAnswer: true,
        },
        additionalDocuments:{
            selectAnswer: false,
        },
        documents,
    }
];