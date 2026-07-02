const {
	getEnforcementNotice
} = require('../../../../src/controllers/before-you-start/enforcement-notice');

const { mockReq, mockRes } = require('../../mocks');

describe('controllers/before-you-start/enforcement-notice', () => {
	let req;
	let res;

	beforeEach(() => {
		req = mockReq();
		res = mockRes();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	describe('getEnforcementNotice', () => {
		it('should call the correct redirect', async () => {
			await getEnforcementNotice(req, res);

			expect(res.redirect).toHaveBeenCalledWith('/before-you-start/about-appeal');
		});
	});
});
