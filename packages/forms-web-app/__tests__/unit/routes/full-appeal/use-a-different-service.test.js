const { get } = require('../router-mock');
const useADifferentServiceController = require('../../../../src/controllers/full-appeal/use-a-different-service');

describe('routes/full-appeal/use-a-different-service', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../src/routes/before-you-start/use-a-different-service');
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith(
			'/use-a-different-service',
			useADifferentServiceController.getUseADifferentService
		);
	});
});
