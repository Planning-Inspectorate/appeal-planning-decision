const { postGeneratePdf } = require('../controllers/pdf');
const { mockPost } = require('../../test/utils/mocks');

describe('routes/pdf', () => {
	it('should define the expected routes', () => {
		// eslint-disable-next-line global-require
		require('./pdf');

		expect(mockPost).toBeCalledTimes(1);
		expect(mockPost).toBeCalledWith('/generate', postGeneratePdf);
	});
});
