const { get, post } = require('../../router-mock');
const {
	getListOfDocuments,
	postListOfDocuments
} = require('../../../../../src/controllers/full-appeal/submit-appeal/list-of-documents');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');

jest.mock('../../../../../src/middleware/fetch-existing-appeal');

describe('routes/full-appeal/submit-appeal/list-of-documents', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../../src/routes/full-appeal/submit-appeal/list-of-documents');
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith(
			'/submit-appeal/list-of-documents-v1',
			[fetchExistingAppealMiddleware],
			getListOfDocuments
		);
		expect(post).toHaveBeenCalledWith('/submit-appeal/list-of-documents-v1', postListOfDocuments);
	});
});
