const kebabCase = require('lodash.kebabcase');
const blobClient = require('#lib/front-office-storage-client');
const archiver = require('archiver');
const { DocumentsRepository } = require('../../../../../../db/repos/repository');
const repo = new DocumentsRepository();
const { storage } = require('#config/config');
const { APPEAL_CASE_STAGE } = require('@planning-inspectorate/data-model');
const getAzureBlobPathFromUri = require('@pins/common/src/lib/getAzureBlobPathFromUri');

/**
 * @param {string} caseStage
 * @param {string} caseReference *
 * @returns {Promise<Array<{fullName: string, blobStorageContainer: string | undefined, blobStoragePath: string, documentURI: string}>>}
 */
async function getBlobCollection(caseStage, caseReference) {
	let documents;
	switch (caseStage) {
		case APPEAL_CASE_STAGE.LPA_QUESTIONNAIRE:
			documents = await repo.getSubmissionDocumentsByCaseRef(caseReference);
			break;
		default:
			return [];
	}

	return documents.map((document) => {
		const { location, originalFileName, type } = document;
		return {
			fullName: `${kebabCase(type)}/${originalFileName}`,
			blobStorageContainer: storage.container,
			blobStoragePath: getAzureBlobPathFromUri(location, storage.host, storage.container),
			documentURI: location
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
