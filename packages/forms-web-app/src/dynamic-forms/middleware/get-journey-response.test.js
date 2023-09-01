const getJourneyResponse = require('./get-journey-response');
const { getQuestionResponse } = require('../../lib/appeals-api-wrapper');
const { JourneyResponse } = require('../journey-response');

jest.mock('../../lib/appeals-api-wrapper');

describe('getJourneyResponse', () => {
	let req, res, next;
	const refId = 'ref';
	const journeyId = 'journeyId';
	const mockGetQuestionResponse = { answers: 'your-answers' };

	beforeEach(() => {
		req = {
			params: {
				referenceId: refId
			}
		};

		res = {
			locals: {}
		};

		next = jest.fn();
		jest.clearAllMocks();
	});

	it('should set res.locals.journeyResponse with a successful response', async () => {
		getQuestionResponse.mockResolvedValue(mockGetQuestionResponse);

		await getJourneyResponse(journeyId)(req, res, next);

		expect(getQuestionResponse).toHaveBeenCalledWith(journeyId, refId);

		expect(res.locals.journeyResponse).toEqual(
			new JourneyResponse(journeyId, refId, mockGetQuestionResponse.answers)
		);

		expect(next).toHaveBeenCalled();
	});

	it('should handle errors and set res.locals.journeyResponse with a default response', async () => {
		getQuestionResponse.mockRejectedValue(new Error('Your error message'));

		await getJourneyResponse(journeyId)(req, res, next);

		expect(getQuestionResponse).toHaveBeenCalledWith(journeyId, refId);

		expect(res.locals.journeyResponse).toBeInstanceOf(JourneyResponse);

		expect(next).toHaveBeenCalled();
	});
});
