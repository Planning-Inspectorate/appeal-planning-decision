const pdfRouter = require('./pdf');
const { mockUse } = require('../../test/utils/mocks');

describe('routes/index', () => {
	it('should define the expected routes', () => {
		// eslint-disable-next-line global-require
		require('./index');

		expect(mockUse).toHaveBeenCalledTimes(1);
		expect(mockUse).toHaveBeenCalledWith('/api/v1', pdfRouter);
	});
});
