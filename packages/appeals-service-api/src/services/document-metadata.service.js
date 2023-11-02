const logger = require('../lib/logger');
const { DocumentMetadataRepository } = require('../repositories/document-metadata-repository');
const ApiError = require('../errors/apiError');
const Joi = require('joi');

/**
 * @typedef {import('../repositories/document-metadata-repository.js').DocumentMetadata} DocumentMetadata
 * @typedef {import('../repositories/document-metadata-repository.js').UpdateResult} UpdateResult
 */

const documentMetaDataSchema = Joi.object({
	caseRef: Joi.string().required(),
	documentId: Joi.string().required()
}).unknown(true);

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

/**
 * Validate and then upsert
 * @param {DocumentMetadata} documentMetadata
 * @returns {Promise<UpdateResult>}
 */
const createOrUpdateDocumentMetadata = async (documentMetadata) => {
	const validationResult = documentMetaDataSchema.validate(documentMetadata);
	if (validationResult.error) {
		throw ApiError.badRequest();
	}

	return documentMetadataRepository.createUpdateDocumentMetadata(documentMetadata);
};

module.exports = {
	getDocumentMetadata,
	createOrUpdateDocumentMetadata
};
