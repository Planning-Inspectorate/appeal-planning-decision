const { decidedAppeals } = require('./controller');
const { APPEAL_CASE_DECISION_OUTCOME } = require('pins-data-model');

jest.mock('#utils/appeal-sorting');
jest.mock('pins-data-model');

const appeal = {
	caseDecisionOutcomeDate: '2024-12-31',
	caseDecisionOutcome: 'allowed',
	appealTypeCode: 'HAS',
	Documents: [{ documentType: 'CASE_DECISION_LETTER', id: 'doc1' }],
	siteAddressLine1: 'a',
	siteAddressLine2: 'b',
	siteAddressTown: 'c',
	siteAddressPostcode: 'd'
};

describe('decidedAppeals', () => {
	let req, res;

	beforeEach(() => {
		req = {
			query: { search: 'AB12 3CD' },
			appealsApiClient: {
				getPostcodeSearchResults: jest.fn()
			},
			session: {}
		};
		res = {
			redirect: jest.fn(),
			render: jest.fn()
		};
	});

	it('should format and sort appeals correctly and render the results', async () => {
		req.session = { interestedParty: { searchPostcode: 'AB12 3CD' } };
		req.appealsApiClient.getPostcodeSearchResults.mockResolvedValue([appeal]);

		await decidedAppeals(req, res);

		expect(res.render).toHaveBeenCalledWith('comment-planning-appeal/decided-appeals/index', {
			postcode: 'AB12 3CD',
			decidedAppeals: [
				{
					...appeal,
					formattedAddress: 'a, b, c, d',
					formattedCaseDecisionDate: '31 Dec 2024',
					formattedDecisionColour: 'green',
					appealTypeName: 'Householder',
					caseDecisionOutcome: APPEAL_CASE_DECISION_OUTCOME.ALLOWED
				}
			]
		});
	});

	it('should override default backlink if no postcode in session', async () => {
		req.session = { navigationHistory: ['thispage', 'lastpage'] };
		req.appealsApiClient.getPostcodeSearchResults.mockResolvedValue([appeal]);

		await decidedAppeals(req, res);

		expect(res.render).toHaveBeenCalledWith('comment-planning-appeal/decided-appeals/index', {
			postcode: 'AB12 3CD',
			decidedAppeals: [
				{
					...appeal,
					formattedAddress: 'a, b, c, d',
					formattedCaseDecisionDate: '31 Dec 2024',
					formattedDecisionColour: 'green',
					appealTypeName: 'Householder',
					caseDecisionOutcome: APPEAL_CASE_DECISION_OUTCOME.ALLOWED
				}
			],
			navigation: ['thispage', 'lastpage?search=AB12 3CD']
		});
	});
});
