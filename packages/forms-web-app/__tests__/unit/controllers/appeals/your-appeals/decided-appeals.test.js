const { get } = require('../../../../../src/controllers/appeals/your-appeals/decided-appeals');

const { VIEW } = require('../../../../../src/lib/views');
const { mockReq, mockRes } = require('../../../mocks');
const {
	mapToAppellantDashboardDisplayData
} = require('../../../../../src/lib/dashboard-functions');
const { filterAppealsWithinGivenDate } = require('../../../../../src/lib/filter-decided-appeals');

jest.mock('../../../../../src/lib/dashboard-functions');
jest.mock('../../../../../src/lib/filter-decided-appeals');

describe('controllers/appeals/your-appeals/decided-appeals', () => {
	let appeal;
	let req;
	let res;

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
		appealDecision: 'allowed',
		caseDecisionOutcomeDate: 'a date'
	};

	beforeEach(() => {
		req = mockReq();
		res = mockRes();

		jest.resetAllMocks();

		appeal = [{ id: 'appeal123', decisionOutcome: 'allowed' }];
		req.appealsApiClient = {
			getUserAppeals: jest.fn()
		};
		req.appealsApiClient.getUserAppeals.mockImplementation(() => Promise.resolve([appeal]));
	});

	it('Test get method calls the correct template and view context', async () => {
		mapToAppellantDashboardDisplayData.mockReturnValue(decidedData);
		filterAppealsWithinGivenDate.mockReturnValue(true);
		const decidedAppeals = [decidedData];
		await get(req, res);

		expect(res.render).toHaveBeenCalledWith(VIEW.YOUR_APPEALS.DECIDED_APPEALS, {
			decidedAppeals
		});
	});
});
