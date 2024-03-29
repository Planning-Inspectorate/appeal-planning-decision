const { VIEW } = require('../../lib/views');

exports.getCommentsQuestion = async (req, res) => {
	res.render(VIEW.FINAL_COMMENT.COMMENTS_QUESTION, {
		hasComment: req.session.finalComment.hasComment
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

	const hasComment = body['comments-question'] === 'yes';
	req.session.finalComment.hasComment = hasComment;

	//todo: if hasComment is false, remove any data in req.session.finalComment.finalComment?

	return hasComment
		? res.redirect(`/${VIEW.FINAL_COMMENT.FINAL_COMMENT}`)
		: res.redirect(`/${VIEW.FINAL_COMMENT.CHECK_YOUR_ANSWERS}`);
};
