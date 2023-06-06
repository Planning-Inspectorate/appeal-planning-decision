const { sendToken, getFinalCommentData } = require('../../lib/appeals-api-wrapper');
const { VIEW } = require('../../lib/views');
const { isTokenValid } = require('../../lib/is-token-valid');
const { enterCodeConfig } = require('@pins/common');
const logger = require('../../lib/logger');

const getInputCodeResendCode = (req, res) => {
	req.session.resendCode = true;
	return res.redirect(`/${VIEW.FINAL_COMMENT.INPUT_CODE}/${req.params.caseReference}`);
};

const getInputCode = async (req, res) => {
	if (
		!req.session.finalComment ||
		req.session.finalComment.horizonId !== req.params.caseReference
	) {
		try {
			req.session.finalComment = await getFinalCommentData(req.params.caseReference);
		} catch (err) {
			logger.error(err, `Final Comment API Error for case reference ${req.params.caseReference}`);
			res.render(VIEW.FINAL_COMMENT.INPUT_CODE, {
				requestNewCodeLink: `input-code/resend-code/${req.params.caseReference}`,
				showNewCode: req.session.resendCode
			});
			delete req.session.resendCode;
			return;
		}
	}

	const {
		session: {
			finalComment: { id, email: emailAddress }
		}
	} = req;

	await sendToken(id, enterCodeConfig.actions.saveAndReturn, emailAddress);

	res.render(VIEW.FINAL_COMMENT.INPUT_CODE, {
		requestNewCodeLink: `input-code/resend-code/${req.params.caseReference}`,
		showNewCode: req.session.resendCode
	});

	delete req.session.resendCode;
};

const postInputCode = async (req, res) => {
	const {
		body,
		session: {
			finalComment: { id }
		}
	} = req;
	const { errors = {}, errorSummary = [] } = body;
	const token = req.body['email-code'];

	if (Object.keys(errors).length > 0) {
		res.render(VIEW.FINAL_COMMENT.INPUT_CODE, {
			token,
			errors,
			errorSummary
		});
		return;
	}

	const tokenResult = await isTokenValid(id, token, req.session);

	req.session.finalComment.secureCodeEnteredCorrectly = tokenResult.valid;

	if (tokenResult.tooManyAttempts) {
		req.session.getNewCodeHref = '/full-appeal/submit-final-comment/input-code';
		return res.redirect(`/${VIEW.FINAL_COMMENT.NEED_NEW_CODE}`);
	}

	if (tokenResult.expired) {
		return res.redirect(`/${VIEW.FINAL_COMMENT.CODE_EXPIRED}`);
	}

	if (!tokenResult.valid) {
		res.render(VIEW.FINAL_COMMENT.INPUT_CODE, {
			token,
			errors: true,
			errorSummary: [{ text: 'Enter a correct code', href: '#' }]
		});
		return;
	}

	return res.redirect(`/${VIEW.FINAL_COMMENT.COMMENTS_QUESTION}`);
};

module.exports = {
	getInputCode,
	postInputCode,
	getInputCodeResendCode
};
