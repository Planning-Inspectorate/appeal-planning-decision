const axios = require('axios');
const config = require('../configuration/config');

class DocumentApiGateway {

    async getDocumentInBase64Encoding(appealId, documentId){
        const documentResponse = await axios.get(`/api/v1/${appealId}/${documentId}/file`, {
            baseURL: config.documents.url,
            params: {
                base64: true
            }
        });

        return documentResponse.data;
    }
}

module.exports = { DocumentApiGateway }