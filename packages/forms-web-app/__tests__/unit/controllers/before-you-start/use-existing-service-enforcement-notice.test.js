const {
	getUseExistingServiceEnforcementNotice
} = require('../../../../src/controllers/before-you-start/use-existing-service-enforcement-notice');

const {
	VIEW: {
		BEFORE_YOU_START: { USE_EXISTING_SERVICE_ENFORCEMENT_NOTICE }
	}
} = require('../../../../src/lib/views');

const { mockReq, mockRes } = require('../../mocks');

const { isLpaInFeatureFlag } = require('#lib/is-lpa-in-feature-flag');

jest.mock('../../../../src/lib/is-lpa-in-feature-flag');

describe('controllers/full-appeal/use-existing-service-enforcement-notice', () => {
	const req = mockReq();
	const res = mockRes();

	it('should call the correct template when v2Enforcement flag is off', async () => {
		isLpaInFeatureFlag.mockReturnValue(false);

		await getUseExistingServiceEnforcementNotice(req, res);

		expect(res.render).toHaveBeenCalledWith(USE_EXISTING_SERVICE_ENFORCEMENT_NOTICE, {
			acpLink: 'https://acp.planninginspectorate.gov.uk/',
			isV2forEnforcement: false
		});
	});

	it('should call the correct template when v2Enforcement flag is on', async () => {
		isLpaInFeatureFlag.mockReturnValue(true);

		await getUseExistingServiceEnforcementNotice(req, res);

		expect(res.render).toHaveBeenCalledWith(USE_EXISTING_SERVICE_ENFORCEMENT_NOTICE, {
			acpLink: 'https://acp.planninginspectorate.gov.uk/',
			isV2forEnforcement: true
		});
	});
});
