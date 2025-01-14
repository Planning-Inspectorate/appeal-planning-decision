const { yourNameGet, yourNamePost } = require('./controller');
const {
	getInterestedPartyFromSession,
	updateInterestedPartySession
} = require('../../../../services/interested-party.service');

jest.mock('../../../../services/interested-party.service');

describe('yourName Controller Tests', () => {
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

	describe('yourNameGet', () => {
		it('should render the your-name page with the interested party', () => {
			const interestedParty = { firstName: 'John', lastName: 'Doe' };
			getInterestedPartyFromSession.mockReturnValue(interestedParty);

			yourNameGet(req, res);

			expect(getInterestedPartyFromSession).toHaveBeenCalledWith(req);
			expect(res.render).toHaveBeenCalledWith('comment-planning-appeal/your-name/index', {
				interestedParty
			});
		});
	});

	describe('yourNamePost', () => {
		it('should render the your-name page with errors if there are validation errors', async () => {
			req.body = {
				errors: { firstName: 'First name is required' },
				errorSummary: [{ text: 'First name is required', href: '#first-name' }],
				'first-name': '',
				'last-name': 'Doe'
			};
			const interestedParty = { firstName: '', lastName: 'Doe' };
			updateInterestedPartySession.mockReturnValue(interestedParty);

			await yourNamePost(req, res);

			expect(updateInterestedPartySession).toHaveBeenCalledWith(req, {
				firstName: '',
				lastName: 'Doe'
			});
			expect(res.render).toHaveBeenCalledWith('comment-planning-appeal/your-name/index', {
				interestedParty,
				errors: req.body.errors,
				errorSummary: req.body.errorSummary
			});
		});

		it('should redirect to enter-address if there are no validation errors', async () => {
			req.body = {
				errors: {},
				errorSummary: [],
				'first-name': 'John',
				'last-name': 'Doe'
			};
			const interestedParty = { firstName: 'John', lastName: 'Doe' };
			updateInterestedPartySession.mockReturnValue(interestedParty);

			await yourNamePost(req, res);

			expect(updateInterestedPartySession).toHaveBeenCalledWith(req, {
				firstName: 'John',
				lastName: 'Doe'
			});
			expect(res.redirect).toHaveBeenCalledWith('enter-address');
		});
	});
});
