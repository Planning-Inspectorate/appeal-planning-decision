const { get, post } = require('../../router-mock');
const {
	getEnterCode,
	postEnterCode
} = require('../../../../../src/controllers/full-appeal/submit-appeal/enter-code');
describe('routes/full-appeal/submit-appeal/enter-code', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../../src/routes/full-appeal/submit-appeal/enter-code');
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith('/submit-appeal/enter-code/:token', getEnterCode);
		expect(post).toHaveBeenCalledWith('/submit-appeal/enter-code', postEnterCode);
	});
});
