const redirectToUnansweredQuestion = require('./redirect-to-unanswered-question');
const { ...params } = require('../s78-lpa-statement/journey');
const { skipIfNoAdditionalDocuments } = require('./redirect-middleware-conditions');
const { JourneyResponse } = require('../journey-response');
const { Journey } = require('../journey');

describe('redirectToUnansweredQuestion Middleware', () => {
	let req, res, next;
	beforeEach(() => {
		req = {
			params: {}
		};
		res = {
			redirect: jest.fn(),
			locals: {}
		};
		next = jest.fn();
		jest.clearAllMocks();
	});
	it('should redirect to the first unanswered question', () => {
		const journeyResponse = new JourneyResponse(
			's78-lpa-statement',
			'0000003',
			{
				lpaStatement: null,
				additionalDocuments: null
			},
			'Q9999'
		);
		res.locals.journeyResponse = journeyResponse;
		const journey = new Journey({ response: journeyResponse, ...params });
		res.locals.journey = journey;
		req.originalUrl = '/manage-appeals/appeal-statement/0000003';
		req.session = {
			navigationHistory: [
				'/manage-appeals/your-appeals',
				'/manage-appeals/appeal-statement/0000003'
			]
		};

		// Passing in array of no conditions, redirects to first unanswered question
		redirectToUnansweredQuestion([])(req, res, next);

		expect(res.redirect).toHaveBeenCalledWith(
			'/manage-appeals/appeal-statement/0000003/appeal-statement'
		);
		expect(next).not.toHaveBeenCalled();
	});
	// Will need uncommenting once the second question is added to the journey

	// it('should redirect to the second unanswered question if the first is answered', () => {
	//     const journeyResponse = new JourneyResponse('s78-lpa-statement', '0000003', {
	//         lpaStatement: 'This is my statement',
	//         additionalDocuments: null,
	//     }, 'Q9999');
	//     res.locals.journeyResponse = journeyResponse;

	//     const journey = new Journey(...buildJourneyParams(journeyResponse));
	//     getJourney.mockReturnValue(journey);

	//     redirectToUnansweredQuestion([])(req, res, next);
	//     console.log(res.redirect.mock.calls)
	//     expect(res.redirect).toHaveBeenCalledWith('/manage-appeals/appeal-statement/0000003/additional-documents');
	//     expect(next).not.toHaveBeenCalled();
	// });
	it('should redirect to the third question only if the second question is answered with "yes"', () => {
		const journeyResponse = new JourneyResponse(
			's78-lpa-statement',
			'0000003',
			{
				lpaStatement: 'This is my statement',
				additionalDocuments: 'yes',
				SubmissionDocumentUpload: []
			},
			'Q9999'
		);
		res.locals.journeyResponse = journeyResponse;
		const journey = new Journey({ response: journeyResponse, ...params });
		res.locals.journey = journey;
		req.originalUrl = '/manage-appeals/appeal-statement/0000003';
		req.session = {
			navigationHistory: [
				'/manage-appeals/your-appeals',
				'/manage-appeals/appeal-statement/0000003'
			]
		};

		redirectToUnansweredQuestion([skipIfNoAdditionalDocuments])(req, res, next);

		expect(res.redirect).toHaveBeenCalledWith(
			'/manage-appeals/appeal-statement/0000003/upload-supporting-documents'
		);
		expect(next).not.toHaveBeenCalled();
	});
	it('should skip the third question if the second question is answered with "no"', () => {
		const journeyResponse = new JourneyResponse(
			's78-lpa-statement',
			'0000003',
			{
				lpaStatement: 'This is my statement',
				additionalDocuments: 'no',
				SubmissionDocumentUpload: []
			},
			'Q9999'
		);
		res.locals.journeyResponse = journeyResponse;
		const journey = new Journey({ response: journeyResponse, ...params });
		res.locals.journey = journey;
		req.originalUrl = '/manage-appeals/appeal-statement/0000003';
		req.session = {
			navigationHistory: [
				'/manage-appeals/your-appeals',
				'/manage-appeals/appeal-statement/0000003'
			]
		};

		redirectToUnansweredQuestion([skipIfNoAdditionalDocuments])(req, res, next);

		expect(next).toHaveBeenCalled();
		expect(res.redirect).not.toHaveBeenCalled();
	});
	it('should call next if all questions are answered and criteria met', () => {
		const journeyResponse = new JourneyResponse(
			's78-lpa-statement',
			'0000003',
			{
				lpaStatement: 'This is my statement',
				additionalDocuments: 'yes',
				uploadLpaStatementDocuments: true,
				SubmissionDocumentUpload: []
			},
			'Q9999'
		);
		res.locals.journeyResponse = journeyResponse;
		const journey = new Journey({ response: journeyResponse, ...params });
		res.locals.journey = journey;
		req.originalUrl = '/manage-appeals/appeal-statement/0000003';
		req.session = {
			navigationHistory: [
				'/manage-appeals/your-appeals',
				'/manage-appeals/appeal-statement/0000003'
			]
		};
		redirectToUnansweredQuestion([])(req, res, next);
		expect(next).toHaveBeenCalled();
		expect(res.redirect).not.toHaveBeenCalled();
	});
});
