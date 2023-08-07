// TODO: note in each file where this is called in context of full planning that a big refactor could be done...
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
