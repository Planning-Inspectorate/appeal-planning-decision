const { checkAnswersGet, checkAnswersPost } = require('./controller');
const {
	getInterestedPartyFromSession,
	markInterestedPartySessionAsSubmitted
} = require('../../../../services/interested-party.service');
const logger = require('../../../../lib/logger');

jest.mock('../../../../services/interested-party.service');
jest.mock('../../../../lib/logger');

describe('checkAnswers Controller Tests', () => {
	let req, res;

	beforeEach(() => {
		req = {
			session: {},
			appealsApiClient: {
				submitInterestedPartySubmission: jest.fn()
			}
		};
		res = {
			render: jest.fn(),
			redirect: jest.fn()
		};
	});

	describe('checkAnswersGet', () => {
		it('should redirect to your-name if firstName or lastName is missing', () => {
			getInterestedPartyFromSession.mockReturnValue({ firstName: '', lastName: 'Doe' });

			checkAnswersGet(req, res);

			expect(getInterestedPartyFromSession).toHaveBeenCalledWith(req);
			expect(res.redirect).toHaveBeenCalledWith('your-name');
		});

		it('should redirect to add-comments if comments are missing', () => {
			getInterestedPartyFromSession.mockReturnValue({
				firstName: 'John',
				lastName: 'Doe',
				comments: ''
			});

			checkAnswersGet(req, res);

			expect(getInterestedPartyFromSession).toHaveBeenCalledWith(req);
			expect(res.redirect).toHaveBeenCalledWith('add-comments');
		});

		it('should render the check-answers page with interestedParty and ipSummaryList', () => {
			const interestedParty = { firstName: 'John', lastName: 'Doe', comments: 'Test comment' };
			getInterestedPartyFromSession.mockReturnValue(interestedParty);

			checkAnswersGet(req, res);

			expect(getInterestedPartyFromSession).toHaveBeenCalledWith(req);
			expect(res.render).toHaveBeenCalledWith('comment-planning-appeal/check-answers/index', {
				interestedParty,
				ipSummaryList: expect.any(Array)
			});
		});
	});

	describe('checkAnswersPost', () => {
		it('should submit interested party submission and redirect to comment-submitted', async () => {
			const interestedParty = { firstName: 'John', lastName: 'Doe', comments: 'Test comment' };
			getInterestedPartyFromSession.mockReturnValue(interestedParty);

			await checkAnswersPost(req, res);

			expect(getInterestedPartyFromSession).toHaveBeenCalledWith(req);
			expect(req.appealsApiClient.submitInterestedPartySubmission).toHaveBeenCalledWith(
				interestedParty
			);
			expect(markInterestedPartySessionAsSubmitted).toHaveBeenCalledWith(req);
			expect(res.redirect).toHaveBeenCalledWith('comment-submitted');
		});

		it('should log an error if submission fails', async () => {
			const interestedParty = { firstName: 'John', lastName: 'Doe', comments: 'Test comment' };
			const error = new Error('Submission failed');
			getInterestedPartyFromSession.mockReturnValue(interestedParty);
			req.appealsApiClient.submitInterestedPartySubmission.mockRejectedValue(error);

			await checkAnswersPost(req, res);

			expect(logger.error).toHaveBeenCalledWith(error);
			expect(markInterestedPartySessionAsSubmitted).toHaveBeenCalledWith(req);
			expect(res.redirect).toHaveBeenCalledWith('comment-submitted');
		});
	});
});
