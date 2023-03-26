// TODO: note in each file where this is called in context of full planning that a big refactor could be done...
const mapDocumentToSavedDocument = (document, documentName) => {
	return {
		id: document.id,
		name: documentName,
		fileName: documentName,
		originalFileName: documentName,
		location: document.location,
		size: document.size
	};
};

const mapMultiFileDocumentToSavedDocument = (document, documentName) => {
	return {
		...mapDocumentToSavedDocument(document, documentName),
		// needed for MoJ multi-file upload display
		message: {
			text: documentName
		}
	};
};

module.exports = { mapDocumentToSavedDocument, mapMultiFileDocumentToSavedDocument };
