const {
	getCannotAppeal
} = require('../../../../src/controllers/appeal-householder-decision/cannot-appeal');
const {
	hasDeadlineDatePassed,
	getDeadlinePeriod,
	businessRulesDeadline
} = require('../../../../src/lib/calculate-deadline');
const { mockReq, mockRes } = require('../../mocks');
const {
	VIEW: {
		APPELLANT_SUBMISSION: { CANNOT_APPEAL }
	}
} = require('../../../../src/lib/views');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/services/task.service');
jest.mock('../../../../src/lib/logger');
jest.mock('../../../../src/lib/calculate-deadline');

describe('controllers/appeal-householder-decision/cannot-appeal', () => {
	let req;
	let res;

	beforeEach(() => {
		req = mockReq();
		res = mockRes();
		jest.resetAllMocks();
	});

	describe('getCannotAppeal', () => {
		it('should call the correct template', () => {
			hasDeadlineDatePassed.mockResolvedValue(false);
			getDeadlinePeriod.mockResolvedValue({
				time: 84,
				duration: 'days',
				description: '12 weeks'
			});
			getCannotAppeal(req, res);
			const { appeal } = req.session;
			const beforeYouStartFirstPage = '/before-you-start';
			const deadlineDate = businessRulesDeadline(
				appeal.decisionDate,
				appeal.appealType,
				appeal.eligibility.applicationDecision
			);
			const deadlinePeriod = getDeadlinePeriod(
				appeal.appealType,
				appeal.eligibility.applicationDecision
			);
			expect(res.render).toHaveBeenCalledTimes(1);
			expect(res.render).toHaveBeenCalledWith(CANNOT_APPEAL, {
				beforeYouStartFirstPage,
				deadlineDate,
				deadlinePeriod: deadlinePeriod.description
			});
		});
	});
});
