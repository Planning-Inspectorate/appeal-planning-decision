const { documentsToSupportGet, documentsToSupportPost } = require('./controller');
const {
	getInterestedPartyFromSession,
	updateInterestedPartySession
} = require('../../../../services/interested-party.service');

jest.mock('../../../../services/interested-party.service');

describe('documentsToSupport Controller Tests', () => {
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

	describe('documentsToSupportGet', () => {
		it('should render the documents-to-support-comment page with the interested party', () => {
			const interestedParty = {};
			getInterestedPartyFromSession.mockReturnValue(interestedParty);

			documentsToSupportGet(req, res);

			expect(getInterestedPartyFromSession).toHaveBeenCalledWith(req);
			expect(res.render).toHaveBeenCalledWith(
				'comment-planning-appeal/documents-to-support/index',
				{
					interestedParty
				}
			);
		});
	});

	describe('documentsToSupportPost', () => {
		it('should render the documents-to-support-comment page with errors if there are validation errors', async () => {
			req.body = {
				errors: {
					hasDocumentsToSupportComment:
						'Select yes if you have additional documents to support your comment'
				},
				errorSummary: [
					{ text: 'radio selection is required', href: '#documents-to-support-comment' }
				],
				'documents-to-support-comment': ''
			};
			const interestedParty = { hasDocumentsToSupportComment: '' };
			updateInterestedPartySession.mockReturnValue(interestedParty);

			await documentsToSupportPost(req, res);

			expect(updateInterestedPartySession).toHaveBeenCalledWith(req, {
				hasDocumentsToSupportComment: ''
			});
			expect(res.render).toHaveBeenCalledWith(
				'comment-planning-appeal/documents-to-support/index',
				{
					interestedParty,
					errors: req.body.errors,
					errorSummary: req.body.errorSummary
				}
			);
		});

		it('should redirect to documents-upload page if there are no validation errors and "yes" is selected', async () => {
			req.body = {
				errors: {},
				errorSummary: [],
				'documents-to-support-comment': 'yes'
			};
			const interestedParty = { hasDocumentsToSupportComment: 'yes' };
			updateInterestedPartySession.mockReturnValue(interestedParty);

			await documentsToSupportPost(req, res);

			expect(updateInterestedPartySession).toHaveBeenCalledWith(req, {
				hasDocumentsToSupportComment: 'yes'
			});
			expect(res.redirect).toHaveBeenCalledWith('documents-upload');
		});

		it('should redirect to check-answer page if there are no validation errors and "no" is selected', async () => {
			req.body = {
				errors: {},
				errorSummary: [],
				'documents-to-support-comment': 'no'
			};
			const interestedParty = { hasDocumentsToSupportComment: 'no' };
			updateInterestedPartySession.mockReturnValue(interestedParty);

			await documentsToSupportPost(req, res);

			expect(updateInterestedPartySession).toHaveBeenCalledWith(req, {
				hasDocumentsToSupportComment: 'no'
			});
			expect(res.redirect).toHaveBeenCalledWith('check-answers');
		});
	});
});
