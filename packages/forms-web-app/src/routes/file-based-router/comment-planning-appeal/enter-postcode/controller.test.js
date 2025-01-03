const { enterPostcodeGet, enterPostcodePost } = require('./controller');
const { fullPostcodeRegex, partialPostcodeRegex } = require('@pins/common/src/regex');

describe('enterPostcode Controller Tests', () => {
	let req, res;

	beforeEach(() => {
		req = {
			body: {}
		};
		res = {
			render: jest.fn(),
			redirect: jest.fn()
		};
	});

	describe('enterPostcodeGet', () => {
		it('should render the enter-postcode page', () => {
			enterPostcodeGet(req, res);

			expect(res.render).toHaveBeenCalledWith('comment-planning-appeal/enter-postcode/index');
		});
	});

	describe('enterPostcodePost', () => {
		it('should render the enter-postcode page with an error if postcode is missing', () => {
			req.body.postcode = '';

			enterPostcodePost(req, res);

			expect(res.render).toHaveBeenCalledWith('comment-planning-appeal/enter-postcode/index', {
				error: { text: 'Enter a postcode', href: '#postcode' },
				value: ''
			});
		});

		it('should render the enter-postcode page with an error if postcode is invalid', () => {
			req.body.postcode = 'invalid';

			enterPostcodePost(req, res);

			expect(res.render).toHaveBeenCalledWith('comment-planning-appeal/enter-postcode/index', {
				error: { text: 'Enter a real postcode', href: '#postcode' },
				value: 'invalid'
			});
		});

		it('should redirect to appeals page if postcode is valid', () => {
			req.body.postcode = 'AB12 3CD';
			partialPostcodeRegex.exec = jest.fn().mockReturnValue(true);
			fullPostcodeRegex.exec = jest.fn().mockReturnValue(true);

			enterPostcodePost(req, res);

			expect(res.redirect).toHaveBeenCalledWith('appeals?search=AB12 3CD');
		});
	});
});
