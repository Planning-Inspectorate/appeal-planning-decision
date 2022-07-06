const appeal = require('@pins/business-rules/test/data/full-appeal');
const cannotAppealController = require('../../../../../src/controllers/full-appeal/submit-appeal/cannot-appeal');
const { mockReq, mockRes } = require('../../../mocks');
const {
	VIEW: {
		FULL_APPEAL: { CANNOT_APPEAL }
	}
} = require('../../../../../src/lib/full-appeal/views');
const { calculateDeadline } = require('../../../../../src/lib/calculate-deadline');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/services/task.service');
jest.mock('../../../../../src/lib/logger');
jest.mock('../../../../../src/lib/calculate-deadline');

describe('controllers/full-appeal/submit-appeal/cannot-appeal', () => {
	let req;
	let res;

	beforeEach(() => {
		req = mockReq(appeal);
		res = mockRes();
		jest.resetAllMocks();
	});

	describe('getCannotAppeal', () => {
		it('should call the correct template', () => {
			calculateDeadline.hasDeadlineDatePassed.mockResolvedValue(false);
			calculateDeadline.getDeadlinePeriod.mockResolvedValue({
				time: 181,
				duration: 'days'
			});
			cannotAppealController.getCannotAppeal(req, res);
			const { appeal } = req.session;
			const beforeYouStartFirstPage = '/before-you-start';
			console.log(appeal.decisionDate, appeal.eligibility.applicationDecision);
			const deadlineDate = calculateDeadline.businessRulesDeadline(
				appeal.decisionDate,
				appeal.appealType,
				appeal.eligibility.applicationDecision
			);
			const deadlinePeriod = calculateDeadline.getDeadlinePeriod(
				appeal.appealType,
				appeal.eligibility.applicationDecision
			);
			expect(res.render).toHaveBeenCalledTimes(1);
			expect(res.render).toHaveBeenCalledWith(CANNOT_APPEAL, {
				beforeYouStartFirstPage,
				deadlineDate,
				deadlinePeriod
			});
		});
	});
});
