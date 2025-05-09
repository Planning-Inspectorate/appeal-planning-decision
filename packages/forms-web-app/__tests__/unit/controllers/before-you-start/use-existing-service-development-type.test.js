const {
	getExistingServiceDevelopmentType
} = require('../../../../src/controllers/before-you-start/use-existing-service-development-type');
const { VIEW } = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');

const req = mockReq();
const res = mockRes();

describe('controllers/before-you-start/use-existing-service-development-type', () => {
	describe('getNoDecision', () => {
		it('should call the correct template', () => {
			getExistingServiceDevelopmentType(req, res);

			expect(res.render).toHaveBeenCalledWith(
				VIEW.BEFORE_YOU_START.USE_EXISTING_SERVICE_DEVELOPMENT_TYPE,
				{
					acpLink: 'https://acp.planninginspectorate.gov.uk/'
				}
			);
		});
	});
});
