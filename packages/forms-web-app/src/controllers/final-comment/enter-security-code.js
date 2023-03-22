const { sendToken } = require('../../lib/appeals-api-wrapper');
const { VIEW } = require('../../lib/views');
const { isTokenValid } = require('../../lib/is-token-valid');

const getEnterSecurityCode = async (req, res) => {
	// DEV ONLY - this will be populated from a call to Horizon once this story is integrated with the other final comment stories
	req.session.finalComment = {
		id: 'e2813fb0-e269-4fe2-890e-6405dbd4a5ea',
		horizonId: null,
		state: 'DRAFT',
		email: 'test@planninginspectorate.gov.uk',
		finalCommentExpiryDate: null,
		finalCommentSubmissionDate: null,
		secureCodeEnteredCorrectly: null,
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
	res.render(VIEW.FINAL_COMMENT.ENTER_CODE);
};

const postEnterSecurityCode = async (req, res) => {
	const {
		body,
		session: {
			finalComment: { id }
		}
	} = req;
	const { errors = {}, errorSummary = [] } = body;
	const token = req.body['email-code'];

	if (Object.keys(errors).length > 0) {
		res.render(VIEW.FINAL_COMMENT.ENTER_CODE, {
			token,
			errors,
			errorSummary
		});
		return;
	}

	const tokenValid = await isTokenValid(id, token);

	if (!tokenValid) {
		res.render(VIEW.FINAL_COMMENT.ENTER_CODE, {
			token,
			errors: true,
			errorSummary: [{ text: 'Enter a correct code', href: '#' }]
		});
		return;
	}

	res.redirect(`/${VIEW.FINAL_COMMENT.COMMENTS_QUESTION}`);
};

module.exports = {
	getEnterSecurityCode,
	postEnterSecurityCode
};
