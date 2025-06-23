const {
	getUseExistingServiceEnforcementNotice
} = require('../../../../src/controllers/before-you-start/use-existing-service-enforcement-notice');

const {
	VIEW: {
		BEFORE_YOU_START: { USE_EXISTING_SERVICE_ENFORCEMENT_NOTICE }
	}
} = require('../../../../src/lib/views');

const { mockReq, mockRes } = require('../../mocks');

describe('controllers/full-appeal/use-existing-service-enforcement-notice', () => {
	const req = mockReq();
	const res = mockRes();

	it('Test the getUseExistingServiceEnforcementNotice method calls the correct template', async () => {
		await getUseExistingServiceEnforcementNotice(req, res);

		expect(res.render).toHaveBeenCalledWith(USE_EXISTING_SERVICE_ENFORCEMENT_NOTICE, {
			acpLink: 'https://acp.planninginspectorate.gov.uk/'
		});
	});
});
