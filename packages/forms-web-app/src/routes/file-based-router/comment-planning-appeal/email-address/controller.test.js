const { emailAddressGet, emailAddressPost } = require('./controller');
const {
	getInterestedPartyFromSession,
	updateInterestedPartySession
} = require('../../../../services/interested-party.service');

jest.mock('../../../../services/interested-party.service');

describe('emailAddress Controller Tests', () => {
	let req, res;

	beforeEach(() => {
		req = {
			session: {},
			body: {}
		};
		res = {
			render: jest.fn(),
			redirect: jest.fn()
		};
	});

	describe('emailAddressGet', () => {
		it('should render the email-address page with the interested party', () => {
			const interestedParty = { emailAddress: 'test@example.com' };
			getInterestedPartyFromSession.mockReturnValue(interestedParty);

			emailAddressGet(req, res);

			expect(getInterestedPartyFromSession).toHaveBeenCalledWith(req);
			expect(res.render).toHaveBeenCalledWith('comment-planning-appeal/email-address/index', {
				interestedParty
			});
		});
	});

	describe('emailAddressPost', () => {
		it('should render the email-address page with errors if there are validation errors', async () => {
			req.body = {
				errors: { emailAddress: 'Email is required' },
				errorSummary: [{ text: 'Email is required', href: '#email-address' }],
				'email-address': ''
			};
			const interestedParty = { emailAddress: '' };
			updateInterestedPartySession.mockReturnValue(interestedParty);

			await emailAddressPost(req, res);

			expect(updateInterestedPartySession).toHaveBeenCalledWith(req, { emailAddress: '' });
			expect(res.render).toHaveBeenCalledWith('comment-planning-appeal/email-address/index', {
				interestedParty,
				errors: req.body.errors,
				errorSummary: req.body.errorSummary
			});
		});

		it('should redirect to add-comments if there are no validation errors', async () => {
			req.body = {
				errors: {},
				errorSummary: [],
				'email-address': 'test@example.com'
			};
			const interestedParty = { emailAddress: 'test@example.com' };
			updateInterestedPartySession.mockReturnValue(interestedParty);

			await emailAddressPost(req, res);

			expect(updateInterestedPartySession).toHaveBeenCalledWith(req, {
				emailAddress: 'test@example.com'
			});
			expect(res.redirect).toHaveBeenCalledWith('add-comments');
		});
	});
});
