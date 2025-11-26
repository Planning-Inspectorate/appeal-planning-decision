const {
	getCannotAppealEnforcement
} = require('../../../../src/controllers/before-you-start/cannot-appeal-enforcement');
const { mockReq, mockRes } = require('../../mocks');
const {
	VIEW: {
		BEFORE_YOU_START: { CANNOT_APPEAL_ENFORCEMENT }
	}
} = require('../../../../src/lib/views');

describe('controllers/appeal-householder-decision/cannot-appeal', () => {
	let req;
	let res;

	beforeEach(() => {
		req = mockReq();
		res = mockRes();
		jest.resetAllMocks();
	});

	describe('getCannotAppealEnforcement', () => {
		it('should call the correct template if cannot appeal an enforcement notice', () => {
			getCannotAppealEnforcement(req, res);
			const beforeYouStartFirstPage = '/before-you-start/local-planning-authority';
			expect(res.render).toHaveBeenCalledTimes(1);
			expect(res.render).toHaveBeenCalledWith(CANNOT_APPEAL_ENFORCEMENT, {
				beforeYouStartFirstPage
			});
		});
	});
});
