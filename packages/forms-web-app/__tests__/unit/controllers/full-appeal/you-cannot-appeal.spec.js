const { getYouCannotAppeal } = require('../../../../src/controllers/full-appeal/you-cannot-appeal');
const { mockReq, mockRes } = require('../../mocks');

const {
	VIEW: { YOU_CANNOT_APPEAL }
} = require('../../../../src/lib/views');

jest.mock('../../../../src/lib/logger');

describe('controllers/full-appeal/out-of-time-shutter-page', () => {
	let req;
	let res;

	beforeEach(() => {
		req = mockReq();
		res = mockRes();

		jest.resetAllMocks();
	});

	describe('getOutOfTimeShutterPage', () => {
		it('should render shutter page with valid appeal deadline and erase appeal in session', async () => {
			const appealDeadline = new Date();
			const appealPeriod = '6 months';
			const appealPeriodToBeDisplayed = '6 months';

			const mockRequest = {
				...req,
				session: {
					appeal: { eligibility: { appealDeadline, appealPeriod } }
				}
			};

			await getYouCannotAppeal(mockRequest, res);
			expect(mockRequest.session.appeal).toBe(null);
			expect(res.render).toHaveBeenCalledWith(YOU_CANNOT_APPEAL, {
				appealDeadline,
				appealPeriodToBeDisplayed
			});
		});
	});
});
