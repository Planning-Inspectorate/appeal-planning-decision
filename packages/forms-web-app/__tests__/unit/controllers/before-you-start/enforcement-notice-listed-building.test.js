const {
	getEnforcementNoticeListedBuilding
} = require('../../../../src/controllers/before-you-start/enforcement-notice-listed-building');

const { mockReq, mockRes } = require('../../mocks');

describe('controllers/before-you-start/enforcement-notice-listed-building', () => {
	let req;
	let res;

	beforeEach(() => {
		req = mockReq();
		res = mockRes();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	describe('getEnforcementNoticeListedBuilding', () => {
		it('should call the correct redirect', async () => {
			await getEnforcementNoticeListedBuilding(req, res);

			expect(res.redirect).toHaveBeenCalledWith('/before-you-start/about-appeal');
		});
	});
});
