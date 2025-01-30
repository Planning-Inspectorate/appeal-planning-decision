const { enterAddressGet, enterAddressPost } = require('./controller');
const {
	getInterestedPartyFromSession,
	updateInterestedPartySession
} = require('../../../../services/interested-party.service');

jest.mock('../../../../services/interested-party.service');

describe('enterAddress Controller Tests', () => {
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

	describe('enterAddressGet', () => {
		it('should render the enter-address page with the interested party', () => {
			const interestedParty = { addressLine1: '123 Main St' };
			getInterestedPartyFromSession.mockReturnValue(interestedParty);

			enterAddressGet(req, res);

			expect(getInterestedPartyFromSession).toHaveBeenCalledWith(req);
			expect(res.render).toHaveBeenCalledWith('comment-planning-appeal/enter-address/index', {
				interestedParty
			});
		});
	});

	describe('enterAddressPost', () => {
		it('should render the enter-address page with errors if there are validation errors', async () => {
			req.body = {
				errors: { addressLine1: 'Address Line 1 is required' },
				errorSummary: [{ text: 'Address Line 1 is required', href: '#addressLine1' }],
				addressLine1: ''
			};
			const interestedParty = { addressLine1: '' };
			updateInterestedPartySession.mockReturnValue(interestedParty);

			await enterAddressPost(req, res);

			expect(updateInterestedPartySession).toHaveBeenCalledWith(req, { addressLine1: '' });
			expect(res.render).toHaveBeenCalledWith('comment-planning-appeal/enter-address/index', {
				interestedParty,
				errors: req.body.errors,
				errorSummary: req.body.errorSummary
			});
		});

		it('should redirect to email-address if there are no validation errors', async () => {
			req.body = {
				errors: {},
				errorSummary: [],
				addressLine1: '123 Main St',
				addressLine2: 'Apt 4',
				townCity: 'Anytown',
				county: 'Anycounty',
				postcode: 'AB12 3CD'
			};
			const interestedParty = {
				addressLine1: '123 Main St',
				addressLine2: 'Apt 4',
				townCity: 'Anytown',
				county: 'Anycounty',
				postcode: 'AB12 3CD'
			};
			updateInterestedPartySession.mockReturnValue(interestedParty);

			await enterAddressPost(req, res);

			expect(updateInterestedPartySession).toHaveBeenCalledWith(req, {
				addressLine1: '123 Main St',
				addressLine2: 'Apt 4',
				townCity: 'Anytown',
				county: 'Anycounty',
				postcode: 'AB12 3CD'
			});
			expect(res.redirect).toHaveBeenCalledWith('email-address');
		});
	});
});
