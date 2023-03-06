const logger = require('../../lib/logger');
const {
	VIEW: {
		FINAL_COMMENT: { FINAL_COMMENT: FINAL_COMMENT }
	}
} = require('../../lib/views');

const getAddFinalComment = async (req, res) => {
	res.render(FINAL_COMMENT, {
		finalComment: req.session?.finalComment?.finalComment,
		hasSensitiveInformation: req.session?.finalComment?.doesNotIncludeSensitiveInformation
	});
};

const postAddFinalComment = async (req, res) => {
	const {
		body,
		body: { errors = {}, errorSummary = [] }
	} = req;

	const finalComment = body['final-comment'];
	const hasSensitiveInformation = !(body['does-not-include-sensitive-information'] === 'i-confirm');

	// DEV ONLY - this check should not be necessary once this page is integrated into the full final-comment journey
	if (!Object.keys(req.session).includes('finalComment')) {
		req.session.finalComment = {};
	}

	if (Object.keys(errors).length > 0) {
		return res.render(FINAL_COMMENT, {
			finalComment,
			hasSensitiveInformation,
			errors,
			errorSummary
		});
	}

	try {
		req.session.finalComment.finalComment = finalComment;
		req.session.finalComment.doesNotIncludeSensitiveInformation = !hasSensitiveInformation;

		return res.redirect(`/full-appeal/submit-final-comment/documents-check`);
	} catch (err) {
		logger.error(err);

		return res.render(FINAL_COMMENT, {
			finalComment,
			hasSensitiveInformation,
			errors,
			errorSummary: [{ text: err.toString(), href: '#' }]
		});
	}
};

module.exports = {
	getAddFinalComment,
	postAddFinalComment
};
