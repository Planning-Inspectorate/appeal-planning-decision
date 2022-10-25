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

module.exports = mapDocumentToSavedDocument;
