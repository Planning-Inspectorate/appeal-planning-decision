const { CASE_TYPES } = require('@pins/common/src/database/data-static');

const mockDeadlineDate = jest.fn();
jest.mock('@pins/business-rules', () => ({
	rules: {
		appeal: {
			deadlineDate: mockDeadlineDate
		}
	}
}));

jest.mock('date-fns', () => ({
	parseISO: jest.fn((date) => new Date(date)),
	endOfDay: jest.fn(),
	addDays: jest.fn(),
	subDays: jest.fn()
}));
jest.mock('date-fns-tz');
jest.mock('./format-date-check-your-answers');

const { getDeadlineV2 } = require('./calculate-deadline');

describe('getDeadlineV2', () => {
	beforeEach(() => {
		jest.clearAllMocks();

		mockDeadlineDate.mockReturnValue(new Date('2026-03-01T23:59:59.999Z'));
	});

	describe('LDC behaviour', () => {
		it('should call businessRulesDeadline (and therefore deadlineDate) with correct parameters for LDC appeal with a decision date', () => {
			getDeadlineV2(CASE_TYPES.LDC.processCode, '', '2026-01-01');

			expect(mockDeadlineDate).toHaveBeenCalledWith(new Date('2026-01-01'), '1012', null);
		});

		it('should not call businessRulesDeadline (and therefore deadlineDate) for LDC appeal without a decision date', () => {
			getDeadlineV2(CASE_TYPES.LDC.processCode);

			expect(mockDeadlineDate).not.toHaveBeenCalled();
		});
	});

	describe('Enforcement behaviour', () => {
		it('should not call businessRulesDeadline (and therefore deadlineDate) for enforcement appeal', () => {
			getDeadlineV2(CASE_TYPES.ENFORCEMENT.processCode, '2026-01-15', '');

			expect(mockDeadlineDate).not.toHaveBeenCalled();
		});

		it('should not call businessRulesDeadline (and therefore deadlineDate) for enforcement listed building appeal', () => {
			getDeadlineV2(CASE_TYPES.ENFORCEMENT_LISTED.processCode, '2026-01-15', '');

			expect(mockDeadlineDate).not.toHaveBeenCalled();
		});
	});

	describe('Default behaviour', () => {
		it('should call businessRulesDeadline (and therefore deadlineDate) with correct parameters for householder appeal', () => {
			getDeadlineV2(CASE_TYPES.HAS.processCode, '', '2026-02-01');

			expect(mockDeadlineDate).toHaveBeenCalledWith(new Date('2026-02-01'), '1001', null);
		});
	});
});
