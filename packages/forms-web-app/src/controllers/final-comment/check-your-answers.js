const { VIEW } = require('../../lib/views');

exports.getCheckYourAnswers = async (req, res) => {
	res.render(VIEW.FINAL_COMMENT.CHECK_YOUR_ANSWERS, {
		hasComments: req.session?.finalComment?.hasComments
	});
};

exports.postCommentsQuestion = async (req, res) => {
	const {
		body: { errors = {}, errorSummary = [] }
	} = req;

	if (Object.keys(errors).length > 0) {
		return res.render(VIEW.FINAL_COMMENT.CHECK_YOUR_ANSWERS, {
			errors,
			errorSummary
		});
	}
};
