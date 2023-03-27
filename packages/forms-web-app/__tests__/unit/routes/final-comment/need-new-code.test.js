const { get } = require('../router-mock');

jest.mock('../../../../src/controllers/final-comment/need-new-code');
jest.mock('../../../../src/validators/validation-error-handler');

const { getNeedNewCode } = require('../../../../src/controllers/final-comment/need-new-code');

describe('routes/final-comment/need-new-code', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../src/routes/final-comment/need-new-code');
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith('/need-new-code', getNeedNewCode);
	});
});
