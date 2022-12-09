const { DocumentGateway } = require('../gateway/document.gateway')

class DocumentService { 

    #documentGateway

    constructor(){
        this.#documentGateway = new DocumentGateway();
    }

    async getAppealDocumentsInBase64Encoding(appealId, documentIds) {
        return await documentIds.map(async documentId => await this.#documentGateway.getAppealDocumentInBase64Encoding(appealId, documentId))
    }
}

module.exports = { DocumentService }