const { get } = require('./index');
const { determineUser } = require('../../lib/determine-user');
const { getUserFromSession } = require('../../services/user.service');
const { getDepartmentFromCode } = require('../../services/department.service');
const { VIEW } = require('../../lib/views');

jest.mock('../../lib/determine-user');
jest.mock('../../services/user.service');
jest.mock('../../services/department.service');
jest.mock('#lib/logger');

describe('get', () => {
	let req, res;

	beforeEach(() => {
		req = {
			params: { appealNumber: '123' },
			originalUrl: '/appeals/123',
			appealsApiClient: {
				getUserByEmailV2: jest.fn(),
				getEventsByCaseRef: jest.fn(),
				getAppealCaseWithRepresentations: jest.fn()
			}
		};
		res = {
			render: jest.fn()
		};
	});

	it('should throw an error if user type is unknown', async () => {
		determineUser.mockReturnValue(null);

		const handler = get();

		await expect(handler(req, res)).rejects.toThrow('Unknown role');
	});

	it('should render the view with the correct context', async () => {
		determineUser.mockReturnValue('Appellant');
		getUserFromSession.mockReturnValue({ email: 'test@example.com' });
		req.appealsApiClient.getUserByEmailV2.mockResolvedValue({ id: 'user-id' });
		req.appealsApiClient.getAppealCaseWithRepresentations.mockResolvedValue({
			LPACode: 'LPA123',
			caseDecisionOutcome: 'GRANTED',
			Documents: []
		});
		req.appealsApiClient.getEventsByCaseRef.mockResolvedValue([]);
		getDepartmentFromCode.mockResolvedValue({ name: 'Test LPA' });

		const handler = get();

		await handler(req, res);

		expect(res.render).toHaveBeenCalledWith(
			VIEW.SELECTED_APPEAL.APPEAL,
			expect.objectContaining({
				appeal: expect.objectContaining({
					appealNumber: '123',
					baseUrl: '/appeals/123'
				})
			})
		);
	});
});
