const { VIEW } = require('../../lib/views');

exports.getDocumentsCheck = async (req, res) => {
	console.log('getDocumentsCheck', req.session);
	res.render(VIEW.FINAL_COMMENT.DOCUMENTS_CHECK, {
		hasDocuments: req.session?.finalComment?.hasDocuments
	});
};

exports.postDocumentsCheck = async (req, res) => {
	console.log('postDocumentsCheck', req.session);
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

	const hasDocuments = body['documents-check'] === 'yes';
	req.session.finalComment.hasDocuments = hasDocuments;

	return hasDocuments
		? res.redirect(`/${VIEW.FINAL_COMMENT.UPLOAD_DOCUMENTS}`)
		: res.redirect(`/${VIEW.FINAL_COMMENT.CHECK_YOUR_ANSWERS}`);
};
