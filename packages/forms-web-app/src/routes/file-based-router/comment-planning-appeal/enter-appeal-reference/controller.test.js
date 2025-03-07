const { enterAppealReferenceGet, enterAppealReferencePost } = require('./controller');

describe('enterAppealReference Controller Tests', () => {
	let req, res;

	beforeEach(() => {
		req = {
			body: {},
			appealsApiClient: {
				appealCaseRefExists: jest.fn()
			}
		};
		res = {
			render: jest.fn(),
			redirect: jest.fn()
		};
	});

	describe('enterAppealReferenceGet', () => {
		it('should render the enter-appeal-reference page', () => {
			enterAppealReferenceGet(req, res);

			expect(res.render).toHaveBeenCalledWith(
				'comment-planning-appeal/enter-appeal-reference/index'
			);
		});
	});

	describe('enterAppealReferencePost', () => {
		it('should render the enter-appeal-reference page with an error if appealReference is missing', async () => {
			req.body['appeal-reference'] = '';

			await enterAppealReferencePost(req, res);

			expect(res.render).toHaveBeenCalledWith(
				'comment-planning-appeal/enter-appeal-reference/index',
				{
					error: { text: 'Enter the appeal reference number', href: '#appeal-reference' },
					value: ''
				}
			);
		});

		it('should render the enter-appeal-reference page with an error if appealReference contains non-digit', async () => {
			req.body['appeal-reference'] = '123ABC';

			await enterAppealReferencePost(req, res);

			expect(res.render).toHaveBeenCalledWith(
				'comment-planning-appeal/enter-appeal-reference/index',
				{
					error: {
						text: 'Enter the appeal reference using numbers 0 to 9',
						href: '#appeal-reference'
					},
					value: '123ABC'
				}
			);
		});

		it('should render the enter-appeal-reference page with an error if appealReference exceeds 7 characters', async () => {
			req.body['appeal-reference'] = '12345678';

			await enterAppealReferencePost(req, res);

			expect(res.render).toHaveBeenCalledWith(
				'comment-planning-appeal/enter-appeal-reference/index',
				{
					error: {
						text: 'Appeal reference number must be 7 characters or less',
						href: '#appeal-reference'
					},
					value: '12345678'
				}
			);
		});

		it('should redirect to the appeal page if appealReference exists', async () => {
			req.body['appeal-reference'] = '1234567';
			req.appealsApiClient.appealCaseRefExists.mockResolvedValue(true);

			await enterAppealReferencePost(req, res);

			expect(req.appealsApiClient.appealCaseRefExists).toHaveBeenCalledWith('1234567');
			expect(res.redirect).toHaveBeenCalledWith('/comment-planning-appeal/appeals/1234567');
		});

		it('should redirect to appeal-search-no-results if appealReference does not exist', async () => {
			req.body['appeal-reference'] = '1234567';
			req.appealsApiClient.appealCaseRefExists.mockResolvedValue(false);

			await enterAppealReferencePost(req, res);

			expect(req.appealsApiClient.appealCaseRefExists).toHaveBeenCalledWith('1234567');
			expect(res.redirect).toHaveBeenCalledWith(
				'appeal-search-no-results?search=1234567&type=appeal-reference'
			);
		});
	});
});
