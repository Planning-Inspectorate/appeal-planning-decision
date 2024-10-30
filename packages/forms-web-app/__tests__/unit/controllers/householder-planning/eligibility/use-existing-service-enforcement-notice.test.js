const useExistingServiceEnforcementNotice = require('../../../../../src/controllers/householder-planning/eligibility/use-existing-service-enforcement-notice');

const {
	VIEW: {
		BEFORE_YOU_START: { USE_EXISTING_SERVICE_ENFORCEMENT_NOTICE }
	}
} = require('../../../../../src/lib/views');

const { mockReq, mockRes } = require('../../../mocks');
const config = require('../../../../../src/config');

describe('getUseExistingServiceEnforcementNotice', () => {
	const req = mockReq();
	const res = mockRes();

	it('Test the getUseExistingServiceEnforcementNotice method calls the correct template', async () => {
		await useExistingServiceEnforcementNotice.getUseExistingServiceEnforcementNotice(req, res);

		expect(res.render).toBeCalledWith(USE_EXISTING_SERVICE_ENFORCEMENT_NOTICE, {
			bannerHtmlOverride: config.betaBannerText,
			acpLink: 'https://acp.planninginspectorate.gov.uk/'
		});
	});
});
