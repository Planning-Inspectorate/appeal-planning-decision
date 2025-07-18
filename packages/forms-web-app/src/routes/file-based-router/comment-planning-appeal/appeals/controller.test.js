const { appeals } = require('./controller');
const {
	getOpenAppeals,
	getClosedAppeals,
	sortByInterestedPartyRepsDueDate,
	sortByCaseReference
} = require('#utils/appeal-sorting');
const { formatAddress } = require('@pins/common/src/lib/format-address');
const { SERVICE_USER_TYPE } = require('@planning-inspectorate/data-model');

jest.mock('#utils/appeal-sorting');
jest.mock('@pins/common/src/lib/format-address');
jest.mock('@planning-inspectorate/data-model');

describe('appeals Controller Tests', () => {
	let req, res;

	beforeEach(() => {
		req = {
			query: {},
			session: {
				interestedParty: {}
			},
			appealsApiClient: {
				getPostcodeSearchResults: jest.fn()
			}
		};
		res = {
			render: jest.fn(),
			redirect: jest.fn()
		};
	});

	it('should handle navigation history and redirect if session + query params do not contain postcode', async () => {
		req.query.search = undefined;
		req.session = {
			interestedParty: {},
			navigationHistory: ['test1', 'test2']
		};

		await appeals(req, res);

		expect(res.redirect).toHaveBeenCalledWith('enter-appeal-reference');
		expect(req.session.navigationHistory).toEqual(['test2']);
	});

	it('should redirect to no-results page with correct navigation history if no search results are found', async () => {
		req.query.search = 'AB12 3CD';
		req.appealsApiClient.getPostcodeSearchResults.mockResolvedValue([]);
		req.session.navigationHistory = [
			'/comment-planning-appeal/appeals',
			'/comment-planning-appeal/enter-postcode'
		];

		await appeals(req, res);

		expect(req.appealsApiClient.getPostcodeSearchResults).toHaveBeenCalledWith({
			postcode: 'AB12 3CD',
			'with-appellant': true
		});
		expect(res.redirect).toHaveBeenCalledWith(
			'appeal-search-no-results?search=AB12 3CD&type=postcode'
		);
		expect(req.session.navigationHistory).toEqual(['/comment-planning-appeal/enter-postcode']);
	});

	it('should render the appeals page with formatted data', async () => {
		req.query.search = 'AB12 3CD';
		const postcodeSearchResults = [
			{
				users: [
					{ serviceUserType: SERVICE_USER_TYPE.APPELLANT, firstName: 'John', lastName: 'Doe' }
				],
				siteAddressPostcode: 'AB12 3CD'
			}
		];
		req.appealsApiClient.getPostcodeSearchResults.mockResolvedValue(postcodeSearchResults);
		req.session.navigationHistory = [
			'/comment-planning-appeal/appeals',
			'/comment-planning-appeal/enter-postcode'
		];
		formatAddress.mockReturnValue('Formatted Address');
		getOpenAppeals.mockReturnValue(postcodeSearchResults);
		getClosedAppeals.mockReturnValue([]);
		sortByInterestedPartyRepsDueDate.mockImplementation((a, b) => a - b);
		sortByCaseReference.mockImplementation((a, b) => a - b);

		await appeals(req, res);

		expect(req.appealsApiClient.getPostcodeSearchResults).toHaveBeenCalledWith({
			postcode: 'AB12 3CD',
			'with-appellant': true
		});
		expect(formatAddress).toHaveBeenCalledWith(postcodeSearchResults[0]);
		expect(getOpenAppeals).toHaveBeenCalledWith(postcodeSearchResults);
		expect(getClosedAppeals).toHaveBeenCalledWith(postcodeSearchResults);
		expect(res.render).toHaveBeenCalledWith('comment-planning-appeal/appeals/index', {
			postcode: 'AB12 3CD',
			openAppeals: postcodeSearchResults,
			closedAppeals: []
		});
		expect(req.session.navigationHistory).toEqual([
			'/comment-planning-appeal/appeals',
			'/comment-planning-appeal/enter-postcode'
		]);
	});
});
