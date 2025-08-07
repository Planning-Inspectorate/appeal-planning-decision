const { get } = require('../../../../src/controllers/appeals/your-appeals');

const { VIEW } = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');
const {
	mapToAppellantDashboardDisplayData,
	isToDoAppellantDashboard,
	updateChildAppealDisplayData
} = require('../../../../src/lib/dashboard-functions');

jest.mock('../../../../src/lib/dashboard-functions');

describe('controllers/appeals/your-appeals', () => {
	let appeal;
	let req;
	let res;

	const toDoData = {
		appealNumber: '0000001',
		address: 'toDoAddress',
		appealType: 'an appeal',
		nextJourneyDue: {
			deadline: 'a future date',
			dueInDays: 1,
			journeyDue: 'Final comments'
		},
		isDraft: false,
		appealDecision: null
	};

	const waitingForReviewData = {
		appealNumber: '0000002',
		address: 'wfrAddress',
		appealType: 'an overdue appeal',
		nextJourneyDue: {
			deadline: 'a past date',
			dueInDays: -1,
			journeyDue: 'testDocument'
		},
		isDraft: false,
		appealDecision: null
	};

	const completedData = {
		appealNumber: '0000003',
		address: 'completedAddress',
		appealType: 'an appeal',
		nextJourneyDue: {
			deadline: null,
			dueInDays: 100000,
			journeyDue: null
		},
		isDraft: false,
		appealDecision: null
	};

	const decidedData = {
		appealNumber: '0000004',
		address: 'decidedAddress',
		appealType: 'an appeal',
		nextJourneyDue: {
			deadline: null,
			dueInDays: 100000,
			journeyDue: null
		},
		isDraft: false,
		appealDecision: 'allowed'
	};

	beforeEach(() => {
		req = mockReq();
		res = mockRes();

		jest.resetAllMocks();

		appeal = { id: 'appeal123' };
		req.appealsApiClient = {
			getUserAppeals: jest.fn()
		};
		req.appealsApiClient.getUserAppeals.mockImplementation(() => Promise.resolve([appeal]));
	});

	describe('Get - To Do appeals', () => {
		it('Displays appeal in to do list if it passes all criteria', async () => {
			mapToAppellantDashboardDisplayData.mockReturnValue(toDoData);
			updateChildAppealDisplayData.mockReturnValue([toDoData]);
			isToDoAppellantDashboard.mockReturnValue(true);
			await get(req, res);

			expect(res.render).toHaveBeenCalledWith(VIEW.APPEALS.YOUR_APPEALS, {
				toDoAppeals: [toDoData],
				waitingForReviewAppeals: [],
				noToDoAppeals: false
			});
		});

		it('Does not display appeal in to do list if all documents have been submitted', async () => {
			mapToAppellantDashboardDisplayData.mockReturnValue(completedData);
			updateChildAppealDisplayData.mockReturnValue([completedData]);

			await get(req, res);

			expect(res.render).toHaveBeenCalledWith(VIEW.APPEALS.YOUR_APPEALS, {
				toDoAppeals: [],
				waitingForReviewAppeals: [completedData],
				noToDoAppeals: true
			});
		});

		it('Does not display appeal in to do list or WFR list if it has been decided', async () => {
			mapToAppellantDashboardDisplayData.mockReturnValue(decidedData);
			updateChildAppealDisplayData.mockReturnValue([]);

			await get(req, res);
			expect(updateChildAppealDisplayData).toHaveBeenCalledWith([]);
			expect(res.render).toHaveBeenCalledWith(VIEW.APPEALS.YOUR_APPEALS, {
				toDoAppeals: [],
				waitingForReviewAppeals: [],
				noToDoAppeals: true
			});
		});

		it('Does not display appeal in to do list if the next document due is overdue', async () => {
			mapToAppellantDashboardDisplayData.mockReturnValue(waitingForReviewData);
			updateChildAppealDisplayData.mockReturnValue([waitingForReviewData]);

			await get(req, res);

			expect(res.render).toHaveBeenCalledWith(VIEW.APPEALS.YOUR_APPEALS, {
				toDoAppeals: [],
				waitingForReviewAppeals: [waitingForReviewData],
				noToDoAppeals: true
			});
		});
	});
});
