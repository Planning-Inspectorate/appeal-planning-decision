const { decidedAppeals } = require('./controller');
const { APPEAL_CASE_DECISION_OUTCOME } = require('@planning-inspectorate/data-model');

jest.mock('#utils/appeal-sorting');
jest.mock('@planning-inspectorate/data-model');

const appeal = Object.freeze({
	caseDecisionOutcomeDate: '2024-12-31',
	caseDecisionOutcome: APPEAL_CASE_DECISION_OUTCOME.ALLOWED,
	appealTypeCode: 'HAS',
	Documents: [{ documentType: 'CASE_DECISION_LETTER', id: 'doc1' }],
	siteAddressLine1: 'a',
	siteAddressLine2: 'b',
	siteAddressTown: 'c',
	siteAddressPostcode: 'd'
});

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
		req.appealsApiClient.getPostcodeSearchResults.mockResolvedValue([structuredClone(appeal)]);

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
					caseDecisionOutcome: 'Allowed'
				}
			]
		});
	});

	it('should render correctly if no results returned from appeals API', async () => {
		req.session = { interestedParty: { searchPostcode: 'AB12 3CD' } };
		req.appealsApiClient.getPostcodeSearchResults.mockResolvedValue([]);

		await decidedAppeals(req, res);

		expect(res.render).toHaveBeenCalledWith('comment-planning-appeal/decided-appeals/index', {
			postcode: 'AB12 3CD',
			decidedAppeals: []
		});
	});

	it('should handle no postcode existing in the session + in the url query params', async () => {
		req.session = {
			interestedParty: {},
			navigationHistory: ['page1', 'page2']
		};
		req.query.search = undefined;

		await decidedAppeals(req, res);

		expect(res.redirect).toHaveBeenCalledWith('enter-appeal-reference');
		expect(req.session.navigationHistory).toEqual(['page2']);
	});

	it('should override default backlink if no postcode in session', async () => {
		req.session = { navigationHistory: ['thispage', 'lastpage'] };
		req.appealsApiClient.getPostcodeSearchResults.mockResolvedValue([structuredClone(appeal)]);

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
					caseDecisionOutcome: 'Allowed'
				}
			],
			navigation: ['thispage', 'lastpage?search=AB12 3CD']
		});
	});
});
