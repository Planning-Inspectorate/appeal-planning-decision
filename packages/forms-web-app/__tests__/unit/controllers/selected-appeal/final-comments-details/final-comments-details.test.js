const finalCommentsController = require('../../../../../src/controllers/selected-appeal/final-comments-details');
const { VIEW } = require('../../../../../src/lib/views');
const { determineUser } = require('../../../../../src/lib/determine-user');
const { mockReq, mockRes } = require('../../../mocks');
const { getDepartmentFromCode } = require('../../../../../src/services/department.service');
const { formatHeadlineData, formatRows } = require('@pins/common');
const { getUserFromSession } = require('../../../../../src/services/user.service');
const { getFinalCommentUserGroup } = require('../../../../../src/lib/selected-appeal-page-setup');
jest.mock('../../../../../src/lib/determine-user');
jest.mock('../../../../../src/services/department.service');
jest.mock('../../../../../src/services/user.service');
jest.mock('@pins/common');
jest.mock('../../../../../src/lib/selected-appeal-page-setup');
describe('controllers/appeals/appeal-final-comments', () => {
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
			getUsersAppealCase: jest.fn(),
			getAppealFinalComments: jest.fn()
		};
		determineUser.mockReturnValue('Appellant');
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
		req.appealsApiClient.getAppealFinalComments.mockImplementation(() =>
			Promise.resolve([{ comments: 'Final Comment' }])
		);
		getDepartmentFromCode.mockImplementation(() => Promise.resolve({ name: 'Test LPA' }));
		formatHeadlineData.mockImplementation(() => ({ title: 'Appeal Headline Data' }));
		formatRows.mockImplementation(() => [{ comments: 'Formatted Final Comment' }]);
		getFinalCommentUserGroup.mockImplementation(() => 'Appellant');
	});
	it('renders the appeal final comments page with the correct data', async () => {
		const controller = finalCommentsController.get();
		await controller(req, res);
		expect(res.render).toHaveBeenCalledWith(
			VIEW.SELECTED_APPEAL.APPEAL_FINAL_COMMENTS,
			expect.objectContaining({
				layoutTemplate: 'layouts/no-banner-link/main.njk',
				titleSuffix: undefined,
				headingPrefix: undefined,
				appeal: expect.objectContaining({
					appealNumber: appealNumber,
					headlineData: { title: 'Appeal Headline Data' },
					formattedComments: expect.arrayContaining([
						expect.objectContaining({
							key: { text: 'Final Comments 1' },
							value: expect.objectContaining({
								text: 'Final Comment',
								truncated: false,
								truncatedText: 'Final Comment',
								documents: undefined
							})
						})
					])
				})
			})
		);
	});
	it('throws an error when determineUser returns null', async () => {
		determineUser.mockReturnValue(null);
		const controller = finalCommentsController.get();
		await expect(controller(req, res)).rejects.toThrow('Unknown role');
	});
	it('throws an error when session does not contain an email', async () => {
		getUserFromSession.mockReturnValueOnce({ email: null });
		const controller = finalCommentsController.get();
		await expect(controller(req, res)).rejects.toThrow('no session email');
	});
	it('handles error when getUserByEmailV2 fails', async () => {
		req.appealsApiClient.getUserByEmailV2.mockImplementationOnce(() =>
			Promise.reject(new Error('API error'))
		);
		const controller = finalCommentsController.get();
		await expect(controller(req, res)).rejects.toThrow('API error');
	});
	it('handles error when getUsersAppealCase fails', async () => {
		req.appealsApiClient.getUsersAppealCase.mockImplementationOnce(() =>
			Promise.reject(new Error('API error'))
		);
		const controller = finalCommentsController.get();
		await expect(controller(req, res)).rejects.toThrow('API error');
	});
	it('handles error when getAppealFinalComments fails', async () => {
		req.appealsApiClient.getAppealFinalComments.mockImplementationOnce(() =>
			Promise.reject(new Error('API error'))
		);
		const controller = finalCommentsController.get();
		await expect(controller(req, res)).rejects.toThrow('API error');
	});
});
