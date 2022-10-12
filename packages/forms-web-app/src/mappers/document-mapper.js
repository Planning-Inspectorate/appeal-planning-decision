// TODO: note in each file where this is called in context of full planning that a big refactor could be done...
const mapDocumentToSavedDocument = (document, documentName) => {
	let savedDocument = {
		id: document.id,
		name: documentName,
		fileName: documentName,
		originalFileName: documentName,
		location: document.location,
		size: document.size
	};

	/**
	 * TODO: When the AS-5031 feature flag is removed...
	 *
	 * 1. Take the doc type/doc group type assignments below add them above
	 * 2. Remove everything below except the return statement
	 *
	 * We're using a check on these values being truthy i.e. "defined" here
	 * to prevent misalignment on feature flag settings. Since we cache
	 * feature flag configs, we should try to only use the flag in one app
	 * so that we don't have two caches in two apps, which can cause obvious
	 * issues!
	 *
	 * The values on `document` below should only be set if the AS-5031 feature
	 * flag is on :) By doing this check we avoid the need to do a feature flag
	 * check across two separate services!
	 */
	const horizonDocumentType = document.horizon_document_type;
	const horizonDocumentGroupType = document.horizon_document_group_type;

	if (horizonDocumentType && horizonDocumentGroupType) {
		savedDocument = {
			...savedDocument,
			horizonDocumentType: horizonDocumentType,
			horizonGroupType: horizonDocumentGroupType
		};
	}

	return savedDocument;
};

module.exports = mapDocumentToSavedDocument;
