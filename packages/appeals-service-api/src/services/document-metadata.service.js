const { DocumentMetadataRepository } = require('../repositories/document-metadata-repository');

const documentMetadataRepository = new DocumentMetadataRepository();

const getDocumentMetadata = async (caseRef, documentType) => {
	const document = await documentMetadataRepository.getDocumentMetadata(caseRef, documentType);
	return document;
};

module.exports = {
	getDocumentMetadata
};
