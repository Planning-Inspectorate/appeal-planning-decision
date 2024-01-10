const { sendToken, getFinalCommentData } = require('../../lib/appeals-api-wrapper');
const { VIEW } = require('../../lib/views');
const { isTokenValid } = require('../../lib/is-token-valid');
const { enterCodeConfig } = require('@pins/common');
const logger = require('../../lib/logger');

const getInputCodeResendCode = (req, res) => {
	// this handles success message when clicking HTML link instead of post request
	req.session.enterCode = req.session.enterCode || {};
	req.session.enterCode.newCode = true;
	return res.redirect(`/${VIEW.FINAL_COMMENT.INPUT_CODE}/${req.params.caseReference}`);
};

const getInputCode = async (req, res) => {
	const caseReference = req.params.caseReference;

	// set up action
	req.session.enterCode = req.session.enterCode || {};
	req.session.enterCode.action = enterCodeConfig.actions.saveAndReturn;

	// show new code success message only once
	const newCode = req.session?.enterCode?.newCode;
	if (newCode) {
		delete req.session?.enterCode?.newCode;
	}

	if (!req.session.finalComment || req.session.finalComment.horizonId !== caseReference) {
		try {
			req.session.enterCodeId = caseReference;
			req.session.finalComment = await getFinalCommentData(caseReference);
		} catch (err) {
			logger.error(err, `Final Comment API Error for case reference ${caseReference}`);
			res.render(VIEW.FINAL_COMMENT.INPUT_CODE, {
				requestNewCodeLink: `resend-code/${caseReference}`,
				showNewCode: newCode
			});
			return;
		}
	} else {
		req.session.enterCodeId = req.session.finalComment.horizonId;
	}

	const {
		session: {
			finalComment: { id, email: emailAddress }
		}
	} = req;

	await sendToken(id, req.session.enterCode.action, emailAddress);

	res.render(VIEW.FINAL_COMMENT.INPUT_CODE, {
		requestNewCodeLink: `resend-code/${caseReference}`,
		showNewCode: newCode
	});
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

	const tokenResult = await isTokenValid(id, token, null, req.session);

	req.session.finalComment.secureCodeEnteredCorrectly = tokenResult.valid;

	if (tokenResult.tooManyAttempts) {
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

	delete req.session.enterCodeId;
	delete req.session?.enterCode?.action;

	return res.redirect(`/${VIEW.FINAL_COMMENT.COMMENTS_QUESTION}`);
};

module.exports = {
	getInputCode,
	postInputCode,
	getInputCodeResendCode
};
