const blobClient = require('#lib/back-office-storage-client');
const archiver = require('archiver');
const { APPEAL_DOCUMENT_TYPE } = require('@planning-inspectorate/data-model');
const { DocumentsRepository } = require('../../../../../db/repos/repository');
const repo = new DocumentsRepository();
const logger = require('#lib/logger');
const { mapDocumentToBlobInfo } = require('#lib/document-utils');
const { checkDocAccess } = require('@pins/common/src/access/document-access');

// limit which doc types can be accessed to avoid accidentally allowing access beyond what was designed for
// if adding representation docs ensure a rep ownership/publish check is added (@pins/common/src/access/representation-ownership)
const allowedDocTypes = new Set([
	APPEAL_DOCUMENT_TYPE.APPELLANT_COSTS_APPLICATION,
	APPEAL_DOCUMENT_TYPE.APPELLANT_COSTS_CORRESPONDENCE,
	APPEAL_DOCUMENT_TYPE.LPA_COSTS_APPLICATION,
	APPEAL_DOCUMENT_TYPE.LPA_COSTS_CORRESPONDENCE
]);

/**
 * @param {string} caseReference
 * @param {import('@pins/database/src/client/client').AppealCase} appealCase
 * @param {import('@pins/database/src/client/client').AppealToUser[]} appealUserRoles
 * @param {import('express-oauth2-jwt-bearer').JWTPayload|undefined} access_token
 * @param {object} id_token
 * @param {string} filter
 * @returns {Promise<Array<{fullName: string, blobStorageContainer: string | undefined, blobStoragePath: string, documentURI: string}>>}
 */
async function getBlobCollection(
	caseReference,
	appealCase,
	appealUserRoles,
	access_token,
	id_token,
	filter = ''
) {
	const docTypeFilters = filter.split(',') || [];

	// ensure only allowed doc type filters
	if (docTypeFilters.length) {
		const hasInvalidDocType = docTypeFilters.some((docType) => !allowedDocTypes.has(docType));
		if (hasInvalidDocType) {
			logger.error(`Invalid document type filter: ${filter}`);
			throw new Error(`Invalid document type filter: ${filter}`);
		}
	}

	if (!docTypeFilters.length) {
		throw new Error('At least one document type filter must be provided');
	}

	const allDocuments = await repo.getDocumentsByTypes({
		documentTypes: docTypeFilters,
		caseReference
	});

	return allDocuments
		.filter((document) => document.redacted)
		.filter((document) =>
			checkDocAccess({
				logger,
				documentWithAppeal: { ...document, AppealCase: appealCase },
				appealUserRoles: appealUserRoles,
				access_token: access_token,
				id_token: id_token
			})
		)
		.map((document) => mapDocumentToBlobInfo(document))
		.filter(Boolean);
}

/**
 * Create a blob download stream
 *
 * @param {string} blobStorageContainer
 * @param {string} blobStoragePath
 * @returns {Promise<Buffer|null>}
 */
async function createBlobDownloadStream(blobStorageContainer, blobStoragePath) {
	const blobName = blobStoragePath.startsWith('/') ? blobStoragePath.slice(1) : blobStoragePath;

	let blobProperties;
	try {
		blobProperties = await blobClient.getProperties(blobStorageContainer, blobName);

		if (!blobProperties) {
			return null;
		}

		const blobDownloadResponseParsed = await blobClient.downloadBlob(
			blobStorageContainer,
			blobName
		);

		if (!blobDownloadResponseParsed?.readableStreamBody) {
			return null;
		}

		// @ts-ignore
		return blobDownloadResponseParsed.blobDownloadStream;
	} catch (error) {
		logger.error(error, 'createBlobDownloadStream failed');
		return null;
	}
}

/**
 * @type {import('express').Handler}
 */
async function getDocumentsByCaseReference(req, res) {
	const { caseReference } = req.params ?? {};
	const { filter } = req.query ?? {};
	const { appealCase, appealUserRoles } = res.locals;
	const access_token = req.auth?.payload;
	const id_token = req.id_token;

	if (!appealCase || !caseReference || !filter) {
		res.sendStatus(400);
		return;
	}

	const blobCollection = await getBlobCollection(
		caseReference,
		appealCase,
		appealUserRoles,
		access_token,
		id_token,
		filter
	);

	const archive = archiver('zip', {
		zlib: { level: 1 } // Sets the compression level.
	});

	archive.pipe(res);

	const /** @type {string[]} */ missingFiles = [];

	if (!blobCollection?.length) {
		missingFiles.push('No documents found in this case');
	} else {
		const blobStreams = await Promise.all(
			blobCollection.map((blobInfo) =>
				createBlobDownloadStream(blobInfo.blobStorageContainer, blobInfo.blobStoragePath)
			)
		);

		blobStreams.forEach((blobStream, index) => {
			if (blobStream) {
				archive.append(blobStream, { name: blobCollection[index].fullName });
			} else {
				missingFiles.push(blobCollection[index].fullName);
				logger.info(blobCollection[index], 'blob not found when creating zip');
			}
		});
	}

	if (missingFiles.length) {
		archive.append(Buffer.from(JSON.stringify(missingFiles)), { name: 'missing-files.json' });
	}

	await archive.finalize();
	return res.status(200);
}

module.exports = {
	getDocumentsByCaseReference
};
