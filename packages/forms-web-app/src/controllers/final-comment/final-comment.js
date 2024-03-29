const logger = require('../../lib/logger');
const {
	VIEW: {
		FINAL_COMMENT: { FINAL_COMMENT: FINAL_COMMENT }
	}
} = require('../../lib/views');

const getAddFinalComment = async (req, res) => {
	res.render(FINAL_COMMENT, {
		finalComment: req.session.finalComment.finalComment,
		doesNotContainSensitiveInformation: req.session.finalComment.doesNotContainSensitiveInformation
	});
};

const postAddFinalComment = async (req, res) => {
	const {
		body,
		body: { errors = {}, errorSummary = [] }
	} = req;

	const finalComment = body['final-comment'];
	const doesNotContainSensitiveInformation =
		body['does-not-include-sensitive-information'] === 'i-confirm';

	if (Object.keys(errors).length > 0) {
		return res.render(FINAL_COMMENT, {
			finalComment,
			doesNotContainSensitiveInformation,
			errors,
			errorSummary
		});
	}

	try {
		req.session.finalComment.finalComment = finalComment;
		req.session.finalComment.doesNotContainSensitiveInformation =
			doesNotContainSensitiveInformation;

		return res.redirect(`/full-appeal/submit-final-comment/documents-check`);
	} catch (err) {
		logger.error(err);

		return res.render(FINAL_COMMENT, {
			finalComment,
			doesNotContainSensitiveInformation,
			errors,
			errorSummary: [{ text: err.toString(), href: '#' }]
		});
	}
};

module.exports = {
	getAddFinalComment,
	postAddFinalComment
};
