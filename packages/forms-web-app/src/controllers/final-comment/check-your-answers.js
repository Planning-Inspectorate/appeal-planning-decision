const { VIEW } = require('../../lib/views');

exports.getCheckYourAnswers = async (req, res) => {
	console.log('-----------------------------------------------');
	console.log('-----------------------------------------------');
	console.log('-----------------------------------------------');
	console.log('-----------------------------------------------');
	console.log('-----------------------------------------------');

	console.log(req.session?.finalComment);

	console.log('-----------------------------------------------');
	console.log('-----------------------------------------------');
	console.log('-----------------------------------------------');
	console.log('-----------------------------------------------');
	console.log('-----------------------------------------------');

	res.render(VIEW.FINAL_COMMENT.CHECK_YOUR_ANSWERS, {
		hasComments: req.session?.finalComment?.hasComments,
		finalComments: req.session?.finalComment
	});
};

exports.postCheckYourAnswers = async (req, res) => {
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
