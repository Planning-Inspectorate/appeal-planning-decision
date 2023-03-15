const { VIEW } = require('../../lib/views');

exports.getDocumentsCheck = async (req, res) => {
	res.render(VIEW.FINAL_COMMENT.DOCUMENTS_CHECK, {
		hasSupportingDocuments: req.session?.finalComment?.hasSupportingDocuments
	});
};

exports.postDocumentsCheck = async (req, res) => {
	const {
		body,
		body: { errors = {}, errorSummary = [] }
	} = req;

	if (Object.keys(errors).length > 0) {
		return res.render(VIEW.FINAL_COMMENT.DOCUMENTS_CHECK, {
			errors,
			errorSummary
		});
	}

	// DEV ONLY - this check should not be necessary once this page is integrated into the full final-comment journey
	if (!Object.keys(req.session).includes('finalComment')) {
		req.session.finalComment = {};
	}

	const hasSupportingDocuments = body['documents-check'] === 'yes';
	req.session.finalComment.hasSupportingDocuments = hasSupportingDocuments;

	return hasSupportingDocuments
		? res.redirect(`/${VIEW.FINAL_COMMENT.UPLOAD_DOCUMENTS}`)
		: res.redirect(`/${VIEW.FINAL_COMMENT.CHECK_YOUR_ANSWERS}`);
};
