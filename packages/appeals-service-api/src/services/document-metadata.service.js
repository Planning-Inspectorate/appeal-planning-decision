const { DocumentMetadataRepository } = require('../repositories/document-metadata-repository');

const documentMetadataRepository = new DocumentMetadataRepository();

const getDocumentMetadata = async (caseRef, documentType, returnMultipleDocuments) => {
	const document = await documentMetadataRepository.getDocumentMetadata(
		caseRef,
		documentType,
		returnMultipleDocuments
	);
	return document;
};

module.exports = {
	getDocumentMetadata
};
