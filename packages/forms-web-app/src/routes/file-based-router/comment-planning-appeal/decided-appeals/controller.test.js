const { decidedAppeals } = require('./controller');
const { APPEAL_CASE_DECISION_OUTCOME } = require('pins-data-model');

jest.mock('#utils/appeal-sorting');
jest.mock('pins-data-model');

describe('decidedAppeals', () => {
	let req, res;

	beforeEach(() => {
		req = {
			query: { search: 'AB12 3CD' },
			appealsApiClient: {
				getPostcodeSearchResults: jest.fn()
			}
		};
		res = {
			redirect: jest.fn(),
			render: jest.fn()
		};
	});

	it('should redirect to no results page if no appeals are found', async () => {
		req.appealsApiClient.getPostcodeSearchResults.mockResolvedValue([]);
		await decidedAppeals(req, res);
		expect(res.redirect).toHaveBeenCalledWith('appeal-search-no-results?search=AB12 3CD');
	});

	it('should format and sort appeals correctly and render the results', async () => {
		const appeals = [
			{
				caseDecisionOutcomeDate: '2024-12-31',
				caseDecisionOutcome: 'allowed',
				appealTypeCode: 'HAS',
				Documents: [{ documentType: 'CASE_DECISION_LETTER', id: 'doc1' }],
				siteAddressLine1: 'a',
				siteAddressLine2: 'b',
				siteAddressTown: 'c',
				siteAddressPostcode: 'd'
			}
		];
		req.appealsApiClient.getPostcodeSearchResults.mockResolvedValue(appeals);

		await decidedAppeals(req, res);

		expect(res.render).toHaveBeenCalledWith('comment-planning-appeal/decided-appeals/index', {
			postcode: 'AB12 3CD',
			decidedAppeals: [
				{
					...appeals[0],
					formattedAddress: 'a, b, c, d',
					formattedCaseDecisionDate: '31 Dec 2024',
					formattedDecisionColour: 'green',
					appealTypeName: 'Householder',
					caseDecisionOutcome: APPEAL_CASE_DECISION_OUTCOME.ALLOWED
				}
			]
		});
	});
});
