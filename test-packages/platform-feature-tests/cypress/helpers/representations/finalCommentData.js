const documents = {    
    uploadSupportDocsFinalComments: 'upload-support-docs-final-comments.pdf',
    uploadAdditionalDocsSupportFinalComments: 'upload-additional-docs-support-final-comments.pdf',
    uploadFileGreaterThan25mb: 'greater-than-25-mb.docx',
    uploadWrongFormatFile: 'wrongFormatFile.xps'
};

export const finalCommentTestCases = [
    {  
        submitFinalComments:{
            selectAnswer: false,
        },
        documents,
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