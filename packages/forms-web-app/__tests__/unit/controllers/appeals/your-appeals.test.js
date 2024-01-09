const { apiClient } = require('../../../../src/lib/appeals-api-client');
const { get } = require('../../../../src/controllers/appeals/your-appeals');

const { VIEW } = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');
const { mapToAppellantDashboardDisplayData } = require('../../../../src/lib/dashboard-functions');

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
	});

	describe('Get - To Do appeals', () => {
		it('Displays appeal in to do list if it passes all criteria', async () => {
			await get(req, res);

			expect(res.render).toHaveBeenCalledWith(VIEW.APPEALS.YOUR_APPEALS, {
				toDoAppeals: [appeal],
				waitingForReviewAppeals: [appeal]
			});
		});

		it('Does not display appeal in to do list if there is no document due', async () => {
			await get(req, res);

			expect(res.render).toHaveBeenCalledWith(VIEW.APPEALS.YOUR_APPEALS, {
				toDoAppeals: [],
				waitingForReviewAppeals: [appeal]
			});
		});

		it('Does not display appeal in to do list if it has been decided', async () => {
			await get(req, res);
			expect(res.render).toHaveBeenCalledWith(VIEW.APPEALS.YOUR_APPEALS, {
				toDoAppeals: [],
				waitingForReviewAppeals: [appeal]
			});
		});

		it('Does not display appeal in to do list if does not have a due date in the future', async () => {
			await get(req, res);

			expect(res.render).toHaveBeenCalledWith(VIEW.APPEALS.YOUR_APPEALS, {
				toDoAppeals: [],
				waitingForReviewAppeals: [appeal]
			});
		});
	});
});
