const { apiClient } = require('../../../../src/lib/appeals-api-client');
const { get } = require('../../../../src/controllers/appeals/your-appeals');

const { VIEW } = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');
const {
	mapToAppellantDashboardDisplayData,
	isEligibilityCompleted,
	hasDecisionDate,
	hasFutureDueDate
} = require('../../../../src/lib/dashboard-functions');

jest.mock('../../../../src/lib/appeals-api-client');
jest.mock('../../../../src/lib/dashboard-functions');

describe('controllers/appeals/your-appeals', () => {
	let appeal;
	let req;
	let res;

	beforeEach(() => {
		req = mockReq();
		res = mockRes();

		jest.resetAllMocks();

		appeal = { id: 'appeal123' };
		apiClient.getUserByEmailV2.mockImplementation(() => Promise.resolve({ id: '123' }));
		apiClient.getUserAppealsById.mockImplementation(() => Promise.resolve([appeal]));
		mapToAppellantDashboardDisplayData.mockImplementation((appeal) => appeal);
		isEligibilityCompleted.mockImplementation(() => false);
		hasDecisionDate.mockImplementation(() => false);
		hasFutureDueDate.mockImplementation(() => false);
	});

	describe('Get - To Do appeals', () => {
		it('Displays appeal in to do list if it passes all criteria', async () => {
			isEligibilityCompleted.mockImplementation(() => true);
			hasDecisionDate.mockImplementation(() => false);
			hasFutureDueDate.mockImplementation(() => true);

			await get(req, res);

			expect(isEligibilityCompleted).toHaveBeenCalledWith(appeal);
			expect(hasDecisionDate).toHaveBeenCalledWith(appeal);
			expect(hasFutureDueDate).toHaveBeenCalledWith(appeal);
			expect(res.render).toHaveBeenCalledWith(VIEW.APPEALS.YOUR_APPEALS, {
				toDoAppeals: [appeal],
				waitingForReviewAppeals: [appeal]
			});
		});

		it('Does not display appeal in to do list if eligibility has not been completed', async () => {
			isEligibilityCompleted.mockImplementation(() => false);

			await get(req, res);

			expect(isEligibilityCompleted).toHaveBeenCalledWith(appeal);
			expect(res.render).toHaveBeenCalledWith(VIEW.APPEALS.YOUR_APPEALS, {
				toDoAppeals: [],
				waitingForReviewAppeals: [appeal]
			});
		});

		it('Does not display appeal in to do list if it has a decision date', async () => {
			isEligibilityCompleted.mockImplementation(() => true);
			hasDecisionDate.mockImplementation(() => true);

			await get(req, res);

			expect(isEligibilityCompleted).toHaveBeenCalledWith(appeal);
			expect(hasDecisionDate).toHaveBeenCalledWith(appeal);
			expect(res.render).toHaveBeenCalledWith(VIEW.APPEALS.YOUR_APPEALS, {
				toDoAppeals: [],
				waitingForReviewAppeals: [appeal]
			});
		});

		it('Does not display appeal in to do list if does not have a due date in the future', async () => {
			isEligibilityCompleted.mockImplementation(() => true);
			hasDecisionDate.mockImplementation(() => false);
			hasFutureDueDate.mockImplementation(() => false);

			await get(req, res);

			expect(isEligibilityCompleted).toHaveBeenCalledWith(appeal);
			expect(hasDecisionDate).toHaveBeenCalledWith(appeal);
			expect(hasFutureDueDate).toHaveBeenCalledWith(appeal);
			expect(res.render).toHaveBeenCalledWith(VIEW.APPEALS.YOUR_APPEALS, {
				toDoAppeals: [],
				waitingForReviewAppeals: [appeal]
			});
		});
	});
});
