const { appeals } = require('./controller');
const {
	getOpenAppeals,
	getClosedAppeals,
	sortByInterestedPartyRepsDueDate,
	sortByCaseReference
} = require('#utils/appeal-sorting');
const { formatAddress } = require('@pins/common/src/lib/format-address');
const { SERVICE_USER_TYPE } = require('pins-data-model');

jest.mock('#utils/appeal-sorting');
jest.mock('@pins/common/src/lib/format-address');
jest.mock('pins-data-model');

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

	it('should redirect to no-results page if no search results are found', async () => {
		req.query.search = 'AB12 3CD';
		req.appealsApiClient.getPostcodeSearchResults.mockResolvedValue([]);

		await appeals(req, res);

		expect(req.appealsApiClient.getPostcodeSearchResults).toHaveBeenCalledWith({
			postcode: 'AB12 3CD',
			'with-appellant': true
		});
		expect(res.redirect).toHaveBeenCalledWith(
			'appeal-search-no-results?search=AB12 3CD&type=postcode'
		);
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
	});
});
