const logger = require('../lib/logger');
const { DocumentMetadataRepository } = require('../repositories/document-metadata-repository');
const ApiError = require('../errors/apiError');

const documentMetadataRepository = new DocumentMetadataRepository();

const getDocumentMetadata = async (caseRef, documentType, returnMultipleDocuments) => {
	const document = await documentMetadataRepository.getDocumentMetadata(
		caseRef,
		documentType,
		returnMultipleDocuments
	);

	if (document === null) {
		logger.info(`document meta data for ${caseRef} not found`);
		throw ApiError.documentMetadataNotFound(caseRef);
	}

	return document;
};

module.exports = {
	getDocumentMetadata
};
