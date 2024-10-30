const {
	getUseExistingServiceApplicationType
} = require('../../../../src/controllers/full-appeal/use-existing-service-application-type');

const {
	VIEW: {
		FULL_APPEAL: { USE_EXISTING_SERVICE_APPLICATION_TYPE }
	}
} = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');
const config = require('../../../../src/config');

describe('controllers/full-appeal/use-existing-service-application-type', () => {
	const req = mockReq();
	const res = mockRes();

	it('Test getUseExistingServiceApplicationType method calls the correct template', async () => {
		await getUseExistingServiceApplicationType(req, res);

		expect(res.render).toBeCalledWith(USE_EXISTING_SERVICE_APPLICATION_TYPE, {
			bannerHtmlOverride: config.betaBannerText,
			acpLink: 'https://acp.planninginspectorate.gov.uk/'
		});
	});
});
