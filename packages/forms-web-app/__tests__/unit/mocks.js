jest.mock('../../src/lib/logger');

const householderAppeal = require('@pins/business-rules/test/data/householder-appeal');

const mockReq = (appeal = householderAppeal) => ({
	cookies: {},
	log: {},
	params: {},
	session: {
		appeal
	},
	appealsApiClient: {
		postLPASubmissionDocumentUpload: jest.fn(),
		postAppellantSubmissionDocumentUpload: jest.fn(),
		deleteLPASubmissionDocumentUpload: jest.fn(),
		deleteAppellantSubmissionDocumentUpload: jest.fn(),
		patchLPAQuestionnaire: jest.fn(),
		updateAppellantSubmission: jest.fn()
	}
});

const mockRes = () => ({
	clearCookie: jest.fn(),
	cookie: jest.fn(),
	locals: jest.fn(),
	redirect: jest.fn(),
	render: jest.fn(),
	sendStatus: jest.fn(),
	status: jest.fn()
});

module.exports = {
	mockReq,
	mockRes
};
