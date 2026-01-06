const { checkAnswersGet, checkAnswersPost } = require('./controller');
const {
	getInterestedPartyFromSession,
	getInterestedPartySubmissionFromSession,
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

		it('should render the check-answers page with interestedParty and ipSummaryList with html formatting', () => {
			const interestedParty = {
				firstName: 'John',
				lastName: 'Doe',
				comments: `Test comment
This is line 2
This is line 3
Line 4`
			};
			getInterestedPartyFromSession.mockReturnValue(interestedParty);

			checkAnswersGet(req, res);

			expect(getInterestedPartyFromSession).toHaveBeenCalledWith(req);
			expect(res.render).toHaveBeenCalledWith(
				'comment-planning-appeal/check-answers/index',
				expect.objectContaining({
					interestedParty,
					ipSummaryList: expect.arrayContaining([
						expect.objectContaining({
							key: {
								text: 'Your comments'
							},
							value: {
								html: 'Test comment<br>This is line 2<br>This is line 3<br>Line 4'
							},
							actions: {
								items: [
									{
										href: 'add-comments',
										text: 'Change'
									}
								]
							}
						})
					])
				})
			);
		});
	});

	describe('checkAnswersPost', () => {
		it('should submit interested party submission and redirect to comment-submitted', async () => {
			const interestedParty = { firstName: 'John', lastName: 'Doe', comments: 'Test comment' };
			getInterestedPartySubmissionFromSession.mockReturnValue(interestedParty);

			await checkAnswersPost(req, res);

			expect(getInterestedPartySubmissionFromSession).toHaveBeenCalledWith(req);
			expect(req.appealsApiClient.submitInterestedPartySubmission).toHaveBeenCalledWith(
				interestedParty
			);
			expect(markInterestedPartySessionAsSubmitted).toHaveBeenCalledWith(req);
			expect(res.redirect).toHaveBeenCalledWith('comment-submitted');
		});

		it('should log an error if submission fails', async () => {
			const interestedParty = { firstName: 'John', lastName: 'Doe', comments: 'Test comment' };
			const error = new Error('Submission failed');
			getInterestedPartySubmissionFromSession.mockReturnValue(interestedParty);
			req.appealsApiClient.submitInterestedPartySubmission.mockRejectedValue(error);

			await checkAnswersPost(req, res);

			expect(logger.error).toHaveBeenCalledWith(error);
			expect(markInterestedPartySessionAsSubmitted).toHaveBeenCalledWith(req);
			expect(res.redirect).toHaveBeenCalledWith('comment-submitted');
		});
	});
});
