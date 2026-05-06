const documents = {    
    uploadSupportDocsFinalComments: 'upload-support-docs-final-comments.pdf',
    uploadAdditionalDocsSupportFinalComments: 'upload-additional-docs-support-final-comments.pdf',
    uploadFileGreaterThan50mb: 'greater-than-50-mb.docx',
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