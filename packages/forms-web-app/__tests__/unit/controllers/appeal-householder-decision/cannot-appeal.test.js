const {
	getCannotAppeal
} = require('../../../../src/controllers/appeal-householder-decision/cannot-appeal');
const { mockReq, mockRes } = require('../../mocks');
const {
	VIEW: {
		APPELLANT_SUBMISSION: { CANNOT_APPEAL }
	}
} = require('../../../../src/lib/views');
const {
	calculateDeadlineFromBeforeYouStart
} = require('@pins/business-rules/src/utils/calculate-deadline-before-you-start');
const { rules } = require('@pins/business-rules');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/services/task.service');
jest.mock('../../../../src/lib/logger');
jest.mock('@pins/business-rules/src/utils/calculate-deadline-before-you-start');

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
			const mockDeadline = new Date('2022-01-01');
			calculateDeadlineFromBeforeYouStart.mockReturnValue(mockDeadline);

			getCannotAppeal(req, res);

			const { appeal } = req.session;
			const deadlinePeriod = rules.appeal.deadlinePeriod(
				appeal.appealType,
				appeal.eligibility.applicationDecision
			);

			expect(res.render).toHaveBeenCalledTimes(1);
			expect(res.render).toHaveBeenCalledWith(CANNOT_APPEAL, {
				beforeYouStartFirstPage: '/before-you-start',
				deadlineDate: mockDeadline,
				deadlinePeriod: deadlinePeriod.description
			});
		});
	});
});
