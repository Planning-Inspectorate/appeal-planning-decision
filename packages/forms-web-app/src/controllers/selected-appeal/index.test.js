const { get, formatDateForNotification } = require('./index');
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

	it('should render the view with LPA and Appellant Cost Decisions if they exist', async () => {
		determineUser.mockReturnValue('Appellant');
		getUserFromSession.mockReturnValue({ email: 'test@example.com' });
		req.appealsApiClient.getUserByEmailV2.mockResolvedValue({ id: 'user-id' });
		req.appealsApiClient.getAppealCaseWithRepresentations.mockResolvedValue({
			LPACode: 'LPA123',
			caseDecisionOutcome: 'GRANTED',
			Documents: [
				{
					id: '31c354b1-287b-4492-92d7-4e23e3aa211c',
					publishedDocumentURI: 'https://example.com/published/doc_002',
					filename: 'lpa-costs-doc.txt',
					documentType: 'lpaCostsDecisionLetter',
					datePublished: null,
					redacted: true,
					virusCheckStatus: 'scanned',
					published: true
				},
				{
					id: '31c354b1-287b-4492-92d7-4e23e3aa211e',
					publishedDocumentURI: 'https://example.com/published/doc_001',
					filename: 'cost-decision-doc.txt',
					documentType: 'appellantCostsDecisionLetter',
					datePublished: null,
					redacted: true,
					virusCheckStatus: 'scanned',
					published: true
				}
			]
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
					baseUrl: '/appeals/123',
					decisionDocuments: expect.arrayContaining([
						expect.objectContaining({
							documentType: expect.stringMatching(
								/^(lpaCostsDecisionLetter|appellantCostsDecisionLetter)$/
							)
						})
					])
				})
			})
		);
	});
});
describe('formatDateForNotification', () => {
	it('should return null if date is null or undefined', () => {
		expect(formatDateForNotification(undefined)).toBeUndefined();
	});

	it('should format a valid date string correctly', () => {
		const date = '2023-01-15T10:00:00Z';
		expect(formatDateForNotification(date)).toBe('11:59pm on 15 January 2023');
	});

	it('should format a date with single digit day and month correctly', () => {
		const date = '2023-03-05T00:00:00Z';
		expect(formatDateForNotification(date)).toBe('11:59pm on 5 March 2023');
	});
});
