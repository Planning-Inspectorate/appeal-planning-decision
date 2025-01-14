const { addCommentsGet, addCommentsPost } = require('./controller');
const {
	getInterestedPartyFromSession,
	updateInterestedPartySession
} = require('../../../../services/interested-party.service');

jest.mock('../../../../services/interested-party.service');

describe('Add comments controller tests', () => {
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

	describe('addCommentsGet', () => {
		it('should render the add-comments page', () => {
			const interestedParty = { name: 'Test Party' };
			getInterestedPartyFromSession.mockReturnValue(interestedParty);

			addCommentsGet(req, res);

			expect(getInterestedPartyFromSession).toHaveBeenCalledWith(req);
			expect(res.render).toHaveBeenCalledWith('comment-planning-appeal/add-comments/index', {
				interestedParty
			});
		});
	});

	describe('addCommentsPost', () => {
		it('should render the add-comments page with errors', async () => {
			req.body = {
				errors: { comment: 'Comment is required' },
				errorSummary: [{ text: 'Comment is required', href: '#comment' }],
				comments: ''
			};
			const interestedParty = { name: 'Test Party' };
			updateInterestedPartySession.mockReturnValue(interestedParty);

			await addCommentsPost(req, res);

			expect(updateInterestedPartySession).toHaveBeenCalledWith(req, { comments: '' });
			expect(res.render).toHaveBeenCalledWith('comment-planning-appeal/add-comments/index', {
				interestedParty,
				errors: req.body.errors,
				errorSummary: req.body.errorSummary
			});
		});

		it('should redirect to check-answers if there are no validation errors', async () => {
			req.body = {
				errors: {},
				errorSummary: [],
				comments: 'Test comment'
			};
			const interestedParty = { name: 'Test Party' };
			updateInterestedPartySession.mockReturnValue(interestedParty);

			await addCommentsPost(req, res);

			expect(updateInterestedPartySession).toHaveBeenCalledWith(req, { comments: 'Test comment' });
			expect(res.redirect).toHaveBeenCalledWith('check-answers');
		});
	});
});
