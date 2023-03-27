const { sendToken } = require('../../lib/appeals-api-wrapper');
const { VIEW } = require('../../lib/views');
const { isTokenValid } = require('../../lib/is-token-valid');
const {
	validation: {
		securityCodeMaxAttempts: { finalComment: finalCommentSecurityCodeMaxAttempts }
	}
} = require('../../config');

const getInputCode = async (req, res) => {
	// DEV ONLY - this will be populated from a call to Horizon once this story is integrated with the other final comment stories
	req.session.finalComment = {
		id: 'e2813fb0-e269-4fe2-890e-6405dbd4a5ea',
		horizonId: null,
		state: 'DRAFT',
		email: 'test@planninginspectorate.gov.uk',
		finalCommentExpiryDate: null,
		finalCommentSubmissionDate: null,
		secureCodeEnteredCorrectly: null,
		incorrectSecurityCodeAttempts: 0,
		hasComment: null,
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
	await sendToken(id, emailAddress);
	res.render(VIEW.FINAL_COMMENT.INPUT_CODE);
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

	req.session.finalComment.secureCodeEnteredCorrectly = await isTokenValid(id, token);

	if (!req.session.finalComment.secureCodeEnteredCorrectly) {
		req.session.finalComment.incorrectSecurityCodeAttempts++;

		if (
			req.session.finalComment.incorrectSecurityCodeAttempts >= finalCommentSecurityCodeMaxAttempts
		) {
			req.session.finalComment.incorrectSecurityCodeAttempts = 0;
			req.session.getNewCodeHref = '/full-appeal/submit-final-comment/input-code';

			res.redirect(`/${VIEW.FINAL_COMMENT.NEED_NEW_CODE}`);

			return;
		}

		res.render(VIEW.FINAL_COMMENT.INPUT_CODE, {
			token,
			errors: true,
			errorSummary: [{ text: 'Enter a correct code', href: '#' }]
		});

		return;
	}

	req.session.finalComment.incorrectSecurityCodeAttempts = 0;
	res.redirect(`/${VIEW.FINAL_COMMENT.COMMENTS_QUESTION}`);
};

module.exports = {
	getInputCode,
	postInputCode
};
