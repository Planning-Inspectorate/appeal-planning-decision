const { VIEW } = require('../../lib/views');

exports.getCommentsQuestion = async (req, res) => {
	let hasComments = null;

	if (
		req.session &&
		req.session.finalComment &&
		Object.prototype.hasOwnProperty.call(req.session.finalComment, 'hasComments')
	) {
		hasComments = req.session.finalComment.hasComments;
	}

	res.render(VIEW.FINAL_COMMENT.COMMENTS_QUESTION, {
		hasComments
	});
};

exports.postCommentsQuestion = async (req, res) => {
	const {
		body,
		body: { errors = {}, errorSummary = [] }
	} = req;

	if (Object.keys(errors).length > 0) {
		return res.render(VIEW.FINAL_COMMENT.COMMENTS_QUESTION, {
			errors,
			errorSummary
		});
	}

	// DEV ONLY - this check should not be necessary once this page is integrated into the full final-comment journey
	if (!Object.keys(req.session).includes('finalComment')) {
		req.session.finalComment = {};
	}

	const hasComments = body['comments-question'] === 'yes';
	req.session.finalComment.hasComments = hasComments;

	return hasComments
		? res.redirect(VIEW.FINAL_COMMENT.FINAL_COMMENT)
		: res.redirect(VIEW.FINAL_COMMENT.CHECK_YOUR_ANSWERS);
};
