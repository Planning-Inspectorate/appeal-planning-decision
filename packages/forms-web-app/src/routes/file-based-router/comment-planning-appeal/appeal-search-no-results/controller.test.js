const { appealSearchNoResults } = require('./controller');
const {
	formatTitlePrefix,
	formatParagraphWording,
	formatLink
} = require('./format-no-results-page');

jest.mock('./format-no-results-page');

describe('appealSearchNoResults Controller Tests', () => {
	let req, res;

	beforeEach(() => {
		req = {
			query: {},
			appealsApiClient: {
				getPostcodeSearchResults: jest.fn()
			}
		};
		res = {
			render: jest.fn(),
			redirect: jest.fn()
		};
	});

	it('should redirect to enter-postcode if typeOfSearch is undefined', async () => {
		req.query.type = undefined;

		await appealSearchNoResults(req, res);

		expect(res.redirect).toHaveBeenCalledWith('enter-postcode');
	});

	it('should render the no-results page with formatted content', async () => {
		req.query = {
			search: 'test search',
			type: 'postcode'
		};

		const mockDecidedAppeals = [
			{ id: '1', caseReference: '1234' },
			{ id: '2', caseReference: '5678' }
		];

		req.appealsApiClient.getPostcodeSearchResults.mockResolvedValue(mockDecidedAppeals);
		formatTitlePrefix.mockReturnValue('Title Prefix');
		formatParagraphWording.mockReturnValue('Paragraph Wording');
		formatLink.mockReturnValue('Link');

		await appealSearchNoResults(req, res);

		expect(formatTitlePrefix).toHaveBeenCalledWith('postcode');
		expect(formatParagraphWording).toHaveBeenCalledWith('postcode');
		expect(formatLink).toHaveBeenCalledWith('postcode');
		expect(req.appealsApiClient.getPostcodeSearchResults).toHaveBeenCalledWith({
			postcode: 'test search',
			'decided-only': true
		});
		expect(res.render).toHaveBeenCalledWith(
			'comment-planning-appeal/appeal-search-no-results/index',
			{
				pageTitle: 'Title Prefix',
				pageHeading: 'Title Prefix',
				paragraph: 'Paragraph Wording',
				linkToRelatedSearchPage: 'Link',
				searchQuery: 'test search',
				viewDecidedAppeals: true,
				typeOfSearch: 'postcode'
			}
		);
	});

	it('should use default search type if typeOfSearch is not a string', async () => {
		req.query = {
			search: 'test search',
			type: ['not a string']
		};

		const mockDecidedAppeals = [];

		req.appealsApiClient.getPostcodeSearchResults.mockResolvedValue(mockDecidedAppeals);
		formatTitlePrefix.mockReturnValue('Title Prefix');
		formatParagraphWording.mockReturnValue('Paragraph Wording');
		formatLink.mockReturnValue('Link');

		await appealSearchNoResults(req, res);

		expect(formatTitlePrefix).toHaveBeenCalledWith('postcode');
		expect(formatParagraphWording).toHaveBeenCalledWith('postcode');
		expect(formatLink).toHaveBeenCalledWith('postcode');
		expect(res.render).toHaveBeenCalledWith(
			'comment-planning-appeal/appeal-search-no-results/index',
			{
				pageTitle: 'Title Prefix',
				pageHeading: 'Title Prefix',
				paragraph: 'Paragraph Wording',
				linkToRelatedSearchPage: 'Link',
				searchQuery: 'test search',
				viewDecidedAppeals: false,
				typeOfSearch: 'postcode'
			}
		);
	});
});
