const { getUserByEmail, getUserAppealsById } = require('../../../../src/lib/appeals-api-wrapper');
const { get } = require('../../../../src/controllers/appeals/your-appeals');

const { VIEW } = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');
const { mapToAppellantDashboardDisplayData } = require('../../../../src/lib/dashboard-functions');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/dashboard-functions');

describe('controllers/appeals/your-appeals', () => {
	let appeals;
	let req;
	let res;

	beforeEach(() => {
		req = mockReq();
		res = mockRes();

		jest.resetAllMocks();

		appeals = [{ id: 'appeal123' }];
		getUserByEmail.mockImplementation(() => Promise.resolve({ id: '123' }));
		getUserAppealsById.mockImplementation(() => Promise.resolve(appeals));
		mapToAppellantDashboardDisplayData.mockImplementation((appeal) => appeal);
	});

	it('Test get method calls the correct template and view context', async () => {
		await get(req, res);

		expect(res.render).toBeCalledWith(VIEW.APPEALS.YOUR_APPEALS, {
			toDoAppeals: appeals,
			waitingForReviewAppeals: appeals
		});
	});
});