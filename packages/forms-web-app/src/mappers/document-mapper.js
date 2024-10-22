/**
 *
 * @param {{ id: string; size: string; location: string; }} document
 * @param {string} documentName
 * @param {string} originalName
 * @returns
 */
const mapDocumentToSavedDocument = (document, documentName, originalName = documentName) => {
	return {
		id: document.id,
		name: documentName,
		fileName: documentName,
		originalFileName: originalName,
		location: document.location,
		size: document.size
	};
};

/**
 *
 * @param {{ id: string; size: string; location: string; }} document
 * @param {string} documentName
 * @param {string} originalName
 * @returns
 */
const mapMultiFileDocumentToSavedDocument = (
	document,
	documentName,
	originalName = documentName
) => {
	return {
		...mapDocumentToSavedDocument(document, documentName, originalName),
		// needed for MoJ multi-file upload display
		message: {
			text: documentName
		}
	};
};

module.exports = { mapDocumentToSavedDocument, mapMultiFileDocumentToSavedDocument };
