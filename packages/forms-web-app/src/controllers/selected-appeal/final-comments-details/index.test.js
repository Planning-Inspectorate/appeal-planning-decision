const { get } = require('./index');
const { VIEW } = require('../../../lib/views');
const { determineUser } = require('../../../lib/determine-user');
const { getUserFromSession } = require('../../../services/user.service');
const { getDepartmentFromCode } = require('../../../services/department.service');
const { formatHeadlineData } = require('@pins/common');
const { formatFinalComment } = require('../../../utils/format-comment-or-statement');

jest.mock('../../../lib/determine-user');
jest.mock('../../../services/user.service');
jest.mock('../../../services/department.service');
jest.mock('@pins/common');
jest.mock('../../../utils/format-comment-or-statement');

describe('get', () => {
	let req, res;

	beforeEach(() => {
		req = {
			params: { appealNumber: '123' },
			originalUrl: '/appeals/123/final-comments',
			appealsApiClient: {
				getUserByEmailV2: jest.fn(),
				getUsersAppealCase: jest.fn(),
				getAppealFinalComments: jest.fn()
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

	it('should throw an error if no session email is found', async () => {
		determineUser.mockReturnValue('appellant');
		getUserFromSession.mockReturnValue({ email: null });

		const handler = get();
		await expect(handler(req, res)).rejects.toThrow('no session email');
	});

	it('should render the correct view with the correct context', async () => {
		determineUser.mockReturnValue('Appellant');
		getUserFromSession.mockReturnValue({ email: 'test@example.com' });
		req.appealsApiClient.getUserByEmailV2.mockResolvedValue({ id: 'user123', serviceUserId: 1 });
		req.appealsApiClient.getUsersAppealCase.mockResolvedValue({ LPACode: 'LPA123' });
		req.appealsApiClient.getAppealFinalComments.mockResolvedValue('comments');
		getDepartmentFromCode.mockResolvedValue({ name: 'LPA Name' });
		formatHeadlineData.mockReturnValue('headlineData');
		formatFinalComment.mockReturnValue('formattedComments');

		const handler = get();
		await handler(req, res);

		expect(res.render).toHaveBeenCalledWith(VIEW.SELECTED_APPEAL.APPEAL_FINAL_COMMENTS, {
			layoutTemplate: 'layouts/no-banner-link/main.njk',
			titleSuffix: expect.any(String),
			headingPrefix: expect.any(String),
			appeal: {
				appealNumber: '123',
				headlineData: 'headlineData',
				formattedComments: 'formattedComments'
			}
		});
	});
});
