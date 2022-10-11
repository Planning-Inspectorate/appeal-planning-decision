const { isFeatureFlagActive } = require('../configuration/featureFlag') // TODO: create this

// TODO: note in each file where this is called in context of full planning that a big refactor could be done...
const mapDocumentToSavedDocument = (document, documentName, req) => {
    let savedDocument = {
        id: document.id,
        name: documentName,
        fileName: documentName,
        originalFileName: documentName,
        location: document.location,
        size: document.size
    }

    if (req.headers && isFeatureFlagActive('horizon-document-labelling', req.headers['local-planning-authority-code'])) {
        savedDocument = { 
            ...savedDocument, 
            horizonDocumentType: document.horizon_document_type,
            horizonGroupType: document.horizon_document_group_type
        }
    }

    return savedDocument;
};

module.exports = mapDocumentToSavedDocument;