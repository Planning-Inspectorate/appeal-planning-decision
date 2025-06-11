const { get } = require('../router-mock');
const youCannotAppealController = require('../../../../src/controllers/full-appeal/you-cannot-appeal');

describe('routes/full-appeal/you-cannot-appeal', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../src/routes/full-appeal/you-cannot-appeal');
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith(
			'/you-cannot-appeal',
			youCannotAppealController.getYouCannotAppeal
		);
	});
});
