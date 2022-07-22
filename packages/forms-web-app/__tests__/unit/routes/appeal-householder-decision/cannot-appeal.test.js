const { get } = require('../router-mock');
const {
	getCannotAppeal
} = require('../../../../src/controllers/appeal-householder-decision/cannot-appeal');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');
describe('routes/appeal-householder-decision/cannot-appeal', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../src/routes/appeal-householder-decision/cannot-appeal');
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith(
			'/cannot-appeal',
			[fetchExistingAppealMiddleware],
			getCannotAppeal
		);
	});
});
