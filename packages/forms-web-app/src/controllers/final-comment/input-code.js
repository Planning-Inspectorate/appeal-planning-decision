const { sendToken } = require('../../lib/appeals-api-wrapper');
const { VIEW } = require('../../lib/views');
const { isTokenValid } = require('../../lib/is-token-valid');
const { enterCodeConfig } = require('@pins/common');

const getInputCodeResendCode = (req, res) => {
	req.session.resendCode = true;
	return res.redirect(`/${VIEW.FINAL_COMMENT.INPUT_CODE}`);
};

const getInputCode = async (req, res) => {
	// DEV ONLY - this will be populated from a call to Horizon once this story is integrated with the other final comment stories
	req.session.finalComment = {
		id: 'e2813fb0-e269-4fe2-890e-6405dbd4a5ea',
		horizonId: null,
		state: 'DRAFT',
		email: 'test@planninginspectorate.gov.uk',
		finalCommentExpiryDate: null,
		finalCommentSubmissionDate: null,
		hasComment: null,
		secureCodeEnteredCorrectly: false,
		doesNotContainSensitiveInformation: null,
		finalComment: null,
		finalCommentAsDocument: {
			uploadedFile: {
				name: '',
				id: null
			}
		},
		hasSupportingDocuments: null,
		typeOfUser: null,
		supportingDocuments: {
			uploadedFiles: []
		}
	};

	const {
		session: {
			finalComment: { id, email: emailAddress }
		}
	} = req;

	await sendToken(id, enterCodeConfig.actions.saveAndReturn, emailAddress);

	res.render(VIEW.FINAL_COMMENT.INPUT_CODE, {
		requestNewCodeLink: 'input-code/resend-code',
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

	//todo: check if distinct expired page required
	if (tokenResult.tooManyAttempts || tokenResult.expired) {
		req.session.getNewCodeHref = '/full-appeal/submit-final-comment/input-code';
		return res.redirect(`/${VIEW.FINAL_COMMENT.NEED_NEW_CODE}`);
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
