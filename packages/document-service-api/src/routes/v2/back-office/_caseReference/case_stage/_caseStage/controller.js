const blobClient = require('#lib/back-office-storage-client');
const archiver = require('archiver');
const { FOLDERS } = require('@pins/common/src/constants');
const { DocumentsRepository } = require('../../../../../../db/repos/repository');
const repo = new DocumentsRepository();
const logger = require('#lib/logger');
const { checkDocAccess } = require('#lib/access-rules');
const {
	checkDocumentAccessByRepresentationOwner,
	mapDocumentToBlobInfo
} = require('#lib/document-access-utils');
/**
 * @param {string} caseStage
 * @param {string} caseReference
 * @param {import('@prisma/client').AppealCase} appealCase
 * @param {import("@prisma/client").AppealToUser[]} appealUserRoles
 * @param {import('express-oauth2-jwt-bearer').JWTPayload|undefined} access_token
 * @param {object} id_token
 * @returns {Promise<Array<{fullName: string, blobStorageContainer: string | undefined, blobStoragePath: string, documentURI: string}>>}
 */
async function getBlobCollection(
	caseStage,
	caseReference,
	appealCase,
	appealUserRoles,
	access_token,
	id_token
) {
	const { email, lpaCode } = id_token;
	const isLpa = !!lpaCode;

	const folders = FOLDERS.filter((folder) => folder.startsWith(`${caseStage}/`));
	if (!folders.length) return [];
	const documentTypes = folders.map((folder) => folder.split('/')[1]);

	const [representations, allDocuments] = await Promise.all([
		repo.getRepresentationDocsByCaseReference({
			caseReference,
			email,
			isLpa
		}),
		repo.getDocumentsByTypes({
			documentTypes,
			caseReference
		})
	]);

	const representationMap = new Map(representations.map((rep) => [rep.documentId, rep]));

	return allDocuments
		.filter((document) => checkDocumentAccessByRepresentationOwner(document, representationMap))
		.filter((document) =>
			checkDocAccess(
				{ ...document, AppealCase: appealCase },
				appealUserRoles,
				access_token,
				id_token
			)
		)
		.map(mapDocumentToBlobInfo)
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
async function getDocumentsByCaseReferenceAndCaseStage(req, res) {
	const { caseReference, caseStage } = req.params ?? {};
	const { appealCase, appealUserRoles } = res.locals;
	const access_token = req.auth?.payload;
	const id_token = req.id_token;

	if (!caseStage || !appealCase || !caseReference) {
		res.sendStatus(400);
		return;
	}

	const blobCollection = await getBlobCollection(
		caseStage,
		caseReference,
		appealCase,
		appealUserRoles,
		access_token,
		id_token
	);

	const archive = archiver('zip', {
		zlib: { level: 9 } // Sets the compression level.
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
	getDocumentsByCaseReferenceAndCaseStage
};
