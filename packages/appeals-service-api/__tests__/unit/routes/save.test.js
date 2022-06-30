const { get, post, patch } = require('./router-mock');
const {
	saveAndReturnGet,
	saveAndReturnCreate,
	saveAndReturnToken
} = require('../../../src/controllers/save');

describe('routes/appeals', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../src/routes/save');
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith('/:token', saveAndReturnGet);
		expect(post).toHaveBeenCalledWith('/', saveAndReturnCreate);
		expect(patch).toHaveBeenCalledWith('/', saveAndReturnToken);
	});
});
