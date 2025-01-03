const { get } = require('./index');
const { formatHeadlineData } = require('@pins/common');
const { formatStatement } = require('../../../utils/format-comment-or-statement');
const { VIEW } = require('../../../lib/views');
const {
	formatTitleSuffix,
	formatStatementHeading,
	getStatementType
} = require('../../../lib/selected-appeal-page-setup');
const { determineUser } = require('../../../lib/determine-user');
const { getUserFromSession } = require('../../../services/user.service');
const { getDepartmentFromCode } = require('../../../services/department.service');

jest.mock('@pins/common');
jest.mock('../../../utils/format-comment-or-statement');
jest.mock('../../../lib/views');
jest.mock('../../../lib/selected-appeal-page-setup');
jest.mock('../../../lib/determine-user');
jest.mock('../../../services/user.service');
jest.mock('../../../services/department.service');

describe('statements controller tests', () => {
	let req, res;

	beforeEach(() => {
		req = {
			params: { appealNumber: '12345' },
			originalUrl: '/appeals/12345/lpa-statement',
			appealsApiClient: {
				getUserByEmailV2: jest.fn(),
				getUsersAppealCase: jest.fn(),
				getAppealStatement: jest.fn()
			}
		};
		res = {
			render: jest.fn()
		};
	});

	it('should throw an error if user type is unknown', async () => {
		determineUser.mockReturnValue(null);

		const controller = get();
		await expect(controller(req, res)).rejects.toThrow('Unknown role');
	});

	it('should throw an error if session email is missing', async () => {
		determineUser.mockReturnValue('appellant');
		getUserFromSession.mockReturnValue({ email: '' });

		const controller = get();
		await expect(controller(req, res)).rejects.toThrow('no session email');
	});

	it('should render the appeal statements page with formatted data', async () => {
		determineUser.mockReturnValue('appellant');
		getUserFromSession.mockReturnValue({ email: 'test@example.com' });
		req.appealsApiClient.getUserByEmailV2.mockResolvedValue({ id: 'user123' });
		req.appealsApiClient.getUsersAppealCase.mockResolvedValue({ LPACode: 'LPA123' });
		req.appealsApiClient.getAppealStatement.mockResolvedValue('statement');
		formatStatement.mockReturnValue('formatted statement');
		getDepartmentFromCode.mockResolvedValue({ name: 'Local Planning Authority' });
		formatHeadlineData.mockReturnValue('headline data');
		formatTitleSuffix.mockReturnValue('title suffix');
		formatStatementHeading.mockReturnValue('statement heading');
		getStatementType.mockReturnValue('statement type');

		const controller = get();
		await controller(req, res);

		expect(determineUser).toHaveBeenCalledWith('/appeals/12345/lpa-statement');
		expect(getUserFromSession).toHaveBeenCalledWith(req);
		expect(req.appealsApiClient.getUserByEmailV2).toHaveBeenCalledWith('test@example.com');
		expect(req.appealsApiClient.getUsersAppealCase).toHaveBeenCalledWith({
			caseReference: '12345',
			role: 'appellant',
			userId: 'user123'
		});
		expect(req.appealsApiClient.getAppealStatement).toHaveBeenCalledWith('12345', 'statement type');
		expect(formatStatement).toHaveBeenCalledWith('statement');
		expect(getDepartmentFromCode).toHaveBeenCalledWith('LPA123');
		expect(formatHeadlineData).toHaveBeenCalledWith(
			{ LPACode: 'LPA123' },
			'Local Planning Authority',
			'appellant'
		);
		expect(formatTitleSuffix).toHaveBeenCalledWith('appellant');
		expect(formatStatementHeading).toHaveBeenCalledWith('/appeals/12345/lpa-statement');
		expect(res.render).toHaveBeenCalledWith(VIEW.SELECTED_APPEAL.APPEAL_STATEMENTS, {
			layoutTemplate: 'layouts/no-banner-link/main.njk',
			titleSuffix: 'title suffix',
			statementHeading: 'statement heading',
			appeal: {
				appealNumber: '12345',
				headlineData: 'headline data',
				formattedStatement: 'formatted statement'
			}
		});
	});
});
