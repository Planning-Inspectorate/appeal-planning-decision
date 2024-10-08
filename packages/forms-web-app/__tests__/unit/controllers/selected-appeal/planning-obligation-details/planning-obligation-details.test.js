const planningObligationDetailsController = require('../../../../../src/controllers/selected-appeal/planning-obligation-details');
const { VIEW } = require('../../../../../src/lib/views');
const { determineUser } = require('../../../../../src/lib/determine-user');
const { mockReq, mockRes } = require('../../../mocks');
const { getDepartmentFromCode } = require('../../../../../src/services/department.service');
const { formatHeadlineData, formatRows } = require('@pins/common');
const { getUserFromSession } = require('../../../../../src/services/user.service');
jest.mock('../../../../../src/lib/determine-user');
jest.mock('../../../../../src/services/department.service');
jest.mock('../../../../../src/services/user.service');
jest.mock('@pins/common');
describe('controllers/appeals/appeal-planning-obligation', () => {
	let req;
	let res;
	const appealNumber = 'ABC123';
	beforeEach(() => {
		req = mockReq();
		res = mockRes();
		req.params.appealNumber = appealNumber;
		req.originalUrl = `/appeals/${appealNumber}`;
		req.appealsApiClient = {
			getUserByEmailV2: jest.fn(),
			getUsersAppealCase: jest.fn()
		};
		determineUser.mockReturnValue('appellant');
		getUserFromSession.mockReturnValue({ email: 'test@example.com' });
		req.appealsApiClient.getUserByEmailV2.mockImplementation(() =>
			Promise.resolve({ id: 'user123', email: 'test@example.com' })
		);
		req.appealsApiClient.getUsersAppealCase.mockImplementation(() =>
			Promise.resolve({
				LPACode: 'ABC',
				appealNumber,
				someOtherData: 'test'
			})
		);
		getDepartmentFromCode.mockImplementation(() => Promise.resolve({ name: 'Test LPA' }));
		formatHeadlineData.mockImplementation(() => ({ title: 'Appeal Headline Data' }));
		formatRows.mockImplementation(() => ({ formattedRows: [] }));
	});
	it('renders the appeal planning obligation page with the correct data', async () => {
		const controller = planningObligationDetailsController.get();
		await controller(req, res);
		expect(res.render).toHaveBeenCalledWith(
			VIEW.SELECTED_APPEAL.APPEAL_PLANNING_OBLIGATION,
			expect.objectContaining({
				appeal: expect.objectContaining({
					appealNumber: 'ABC123',
					headlineData: { title: 'Appeal Headline Data' },
					planningObligationDetails: { formattedRows: [] }
				})
			})
		);
	});
	it('throws an error when determineUser returns null', async () => {
		determineUser.mockReturnValue(null);
		const controller = planningObligationDetailsController.get();
		await expect(controller(req, res)).rejects.toThrow('Unknown role');
	});
	it('throws an error when session does not contain an email', async () => {
		getUserFromSession.mockReturnValueOnce({ email: null });
		const controller = planningObligationDetailsController.get();
		await expect(controller(req, res)).rejects.toThrow('no session email');
	});
	it('handles error when getUserByEmailV2 fails', async () => {
		req.appealsApiClient.getUserByEmailV2.mockImplementationOnce(() =>
			Promise.reject(new Error('API error'))
		);
		const controller = planningObligationDetailsController.get();
		await expect(controller(req, res)).rejects.toThrow('API error');
	});
	it('handles error when getUsersAppealCase fails', async () => {
		req.appealsApiClient.getUsersAppealCase.mockImplementationOnce(() =>
			Promise.reject(new Error('API error'))
		);
		const controller = planningObligationDetailsController.get();
		await expect(controller(req, res)).rejects.toThrow('API error');
	});
});
