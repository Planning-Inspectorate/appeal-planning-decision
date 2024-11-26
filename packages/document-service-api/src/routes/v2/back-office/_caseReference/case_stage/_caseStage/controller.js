const kebabCase = require('lodash.kebabcase');
const blobClient = require('#lib/back-office-storage-client');
const { isFeatureActive } = require('#config/featureFlag');
const { FLAG } = require('@pins/common/src/feature-flags');
const archiver = require('archiver');
const { FOLDERS } = require('@pins/common/src/constants');
const { DocumentsRepository } = require('../../../../../../db/repos/repository');
const repo = new DocumentsRepository();
const { boStorage } = require('#config/config');
const logger = require('#lib/logger');
const getAzureBlobPathFromUri = require('@pins/common/src/lib/getAzureBlobPathFromUri');

/**
 * @param {string} caseStage
 * @param {string} caseReference *
 * @returns {Promise[]}
 */
async function getBlobCollection(caseStage, caseReference) {
	const folders = FOLDERS.filter((folder) => folder.startsWith(`${caseStage}/`));

	return (
		await Promise.all(
			folders.map(async (folder) => {
				const [, documentType] = folder.split('/');
				return await repo.getDocuments({ documentType, caseReference });
			})
		)
	)
		.flat()
		.map((document) => {
			const { filename, documentURI, documentType } = document;
			return {
				fullName: `${kebabCase(documentType)}/${filename}`,
				blobStorageContainer: boStorage.container,
				blobStoragePath: getAzureBlobPathFromUri(documentURI, boStorage.host, boStorage.container),
				documentURI
			};
		});
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
		return null;
	}
}

/**
 * @type {import('express').Handler}
 */
async function getDocumentsByCaseReferenceAndCaseStage(req, res) {
	if (!(await isFeatureActive(FLAG.SERVE_BO_DOCUMENTS))) {
		res.sendStatus(501);
		return;
	}

	const { caseStage, caseReference } = req.params ?? {};

	if (!caseStage || !caseReference) {
		res.sendStatus(400);
		return;
	}

	const blobCollection = await getBlobCollection(caseStage, caseReference);

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
