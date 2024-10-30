const {
	getUseADifferentService
} = require('../../../../src/controllers/full-appeal/use-a-different-service');

const {
	VIEW: {
		FULL_APPEAL: { USE_A_DIFFERENT_SERVICE }
	}
} = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');
const config = require('../../../../src/config');

describe('controllers/full-appeal/use-a-different-service', () => {
	const req = mockReq();
	const res = mockRes();

	it('Test the getPlanningDepartment method calls the correct template', async () => {
		await getUseADifferentService(req, res);

		expect(res.render).toBeCalledWith(USE_A_DIFFERENT_SERVICE, {
			bannerHtmlOverride: config.betaBannerText,
			acpLink: 'https://acp.planninginspectorate.gov.uk/'
		});
	});
});
