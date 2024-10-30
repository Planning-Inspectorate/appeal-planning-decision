const {
	getUseExistingServiceLocalPlanningDepartment
} = require('../../../../src/controllers/full-appeal/use-existing-service-local-planning-department');

const {
	VIEW: {
		FULL_APPEAL: { USE_EXISTING_SERVICE_LOCAL_PLANNING_DEPARTMENT }
	}
} = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');
const config = require('../../../../src/config');

describe('controllers/full-appeal/use-existing-service-local-planning-department', () => {
	const req = mockReq();
	const res = mockRes();

	it('Test getUseExistingServiceLocalPlanningDepartment method calls the correct template', async () => {
		await getUseExistingServiceLocalPlanningDepartment(req, res);

		expect(res.render).toBeCalledWith(USE_EXISTING_SERVICE_LOCAL_PLANNING_DEPARTMENT, {
			bannerHtmlOverride: config.betaBannerText,
			acpLink: 'https://acp.planninginspectorate.gov.uk/'
		});
	});
});
