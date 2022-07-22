const { get, post } = require('../router-mock');
const {
	getCodeExpired,
	postCodeExpired
} = require('../../../../src/controllers/appeal-householder-decision/code-expired');
describe('routes/full-appeal/submit-appeal/code-expired', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../src/routes/appeal-householder-decision/code-expired');
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith('/appeal-householder-decision/code-expired', getCodeExpired);
		expect(post).toHaveBeenCalledWith('/appeal-householder-decision/code-expired', postCodeExpired);
	});
});
