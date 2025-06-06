const kebabCase = require('lodash.kebabcase');
const { boStorage } = require('#config/config');
const getAzureBlobPathFromUri = require('@pins/common/src/lib/getAzureBlobPathFromUri');
const { APPEAL_REPRESENTATION_STATUS } = require('pins-data-model');

/**
 * Determines if a document is available for the user based on representation ownership and status.
 * @param {import("@prisma/client").Document} document
 * @param {Map<string, import('../db/repos/repository').FlatRepDocOwnership>} representationMap
 * @returns {boolean}
 */
exports.checkDocumentAccessByRepresentationOwner = (document, representationMap) => {
	// see if the document belongs to a representation
	const rep = representationMap.get(document.id);

	// doc does not belong to a representation so we can skip representation checks
	if (!rep) {
		return true;
	}

	// return true if the user either owns the representation or it is published
	return (
		rep.userOwnsRepresentation ||
		rep.representationStatus === APPEAL_REPRESENTATION_STATUS.PUBLISHED
	);
};

/**
 * Maps a document object to blob info.
 * @param {import("@prisma/client").Document} document
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
