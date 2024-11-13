const {
	getUseExistingServiceListedBuilding
} = require('../../../../src/controllers/before-you-start/use-existing-service-listed-building');
const { VIEW } = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');
const config = require('../../../../src/config');

const req = mockReq();
const res = mockRes();

describe('controllers/before-you-start/use-existing-service-listed-building', () => {
	describe('getNoDecision', () => {
		it('should call the correct template', () => {
			getUseExistingServiceListedBuilding(req, res);

			expect(res.render).toHaveBeenCalledWith(
				VIEW.BEFORE_YOU_START.USE_EXISTING_SERVICE_LISTED_BUILDING,
				{
					bannerHtmlOverride: config.betaBannerText,
					acpLink: 'https://acp.planninginspectorate.gov.uk/'
				}
			);
		});
	});
});
