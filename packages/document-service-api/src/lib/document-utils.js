const kebabCase = require('lodash.kebabcase');
const { boStorage } = require('#config/config');
const getAzureBlobPathFromUri = require('@pins/common/src/lib/getAzureBlobPathFromUri');

/**
 * Maps a document object to blob info.
 * @param {import('@pins/database/src/client/client').Document} document
 * @returns {{fullName: string, blobStorageContainer: string | undefined, blobStoragePath: string, documentURI: string}|null}
 */
exports.mapDocumentToBlobInfo = (document) => {
	const { filename, documentURI, documentType } = document;
	if (!documentType) return null;
	return {
		fullName: `${kebabCase(documentType)}/${filename}`,
		blobStorageContainer: boStorage.container,
		blobStoragePath: getAzureBlobPathFromUri(documentURI, boStorage.host, boStorage.container),
		documentURI
	};
};
