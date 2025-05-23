const useExistingServiceCostsController = require('../../../../../src/controllers/householder-planning/eligibility/use-existing-service-costs');
const config = require('../../../../../src/config');

const {
	VIEW: {
		HOUSEHOLDER_PLANNING: {
			ELIGIBILITY: { USE_EXISTING_SERVICE_COSTS }
		}
	}
} = require('../../../../../src/lib/views');

const { mockReq, mockRes } = require('../../../mocks');

describe('getUseExistingServiceCosts', () => {
	const req = mockReq();
	const res = mockRes();

	it('Test the getUseExistingServiceCosts method calls the correct template', async () => {
		await useExistingServiceCostsController.getUseExistingServiceCosts(req, res);

		expect(res.render).toHaveBeenCalledWith(USE_EXISTING_SERVICE_COSTS, {
			acpLink: 'https://acp.planninginspectorate.gov.uk/',
			bannerHtmlOverride:
				config.betaBannerText +
				config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl('HAS'))
		});
	});
});
