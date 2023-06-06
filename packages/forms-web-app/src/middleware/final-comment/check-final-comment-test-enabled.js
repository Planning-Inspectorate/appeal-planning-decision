const logger = require('../../lib/logger');
const config = require('../../config');
const { VIEW } = require('../../lib/views');

const checkFinalCommentTestEnabled = (req, res, next) => {
	//check if test params and testing override enabled
	if (req.params.caseReference === 'test' && config.server.allowTestingOverrides) {
		logger.info('Creating mock final comment in session');

		req.session.finalComment = createMockFinalComment();

		return res.redirect(`/${VIEW.FINAL_COMMENT.INPUT_CODE}/${req.session.finalComment.horizonId}`);
	}

	//otherwise continue as normal
	return next();
};

const createMockFinalComment = () => {
	let tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);

	return {
		id: 'e2813fb0-e269-4fe2-890e-6405dbd4a5ea',
		horizonId: 'test123',
		email: 'test@planninginspectorate.gov.uk',
		finalCommentExpiryDate: tomorrow,
		finalCommentSubmissionDate: null,
		secureCodeEnteredCorrectly: false,
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
};

module.exports = checkFinalCommentTestEnabled;
