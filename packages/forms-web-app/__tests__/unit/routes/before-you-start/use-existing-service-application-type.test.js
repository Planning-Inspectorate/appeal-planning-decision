const { get } = require('../router-mock');
const useExistingServiceApplicationType = require('../../../../src/controllers/before-you-start/use-existing-service-application-type');

describe('routes/before-you-start/use-existing-service-application-type', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../src/routes/before-you-start/use-existing-service-application-type');
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith(
			'/use-existing-service-application-type',
			useExistingServiceApplicationType.getUseExistingServiceApplicationType
		);
	});
});
