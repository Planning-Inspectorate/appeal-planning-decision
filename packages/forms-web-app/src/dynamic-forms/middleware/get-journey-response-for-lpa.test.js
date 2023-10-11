const getJourneyResponse = require('./get-journey-response-for-lpa');
const { getQuestionResponse } = require('../../lib/appeals-api-wrapper');
const { JourneyResponse } = require('../journey-response');
const { getAppealByLPACodeAndId } = require('../../lib/appeals-api-wrapper');
const { getLPAUserFromSession } = require('../../services/lpa-user.service');

jest.mock('../../lib/appeals-api-wrapper');
jest.mock('../../services/lpa-user.service');

describe('getJourneyResponse', () => {
	let req, res, next;
	const refId = 'ref';
	const mockGetQuestionResponse = { answers: 'your-answers' };
	const mockAppeal = { appealType: 'Householder (HAS) Appeal' };
	const appealType = 'has-questionnaire';
	const mockUser = {
		lpaCode: '1'
	};

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
		getLPAUserFromSession.mockReturnValue(mockUser);
		getAppealByLPACodeAndId.mockResolvedValue(mockAppeal);
		getQuestionResponse.mockResolvedValue(mockGetQuestionResponse);

		await getJourneyResponse()(req, res, next);

		expect(getLPAUserFromSession).toHaveBeenCalledWith(req);
		expect(getAppealByLPACodeAndId).toHaveBeenCalledWith(mockUser.lpaCode, refId);
		expect(getQuestionResponse).toHaveBeenCalledWith(appealType, refId);

		expect(res.locals.journeyResponse).toEqual(
			new JourneyResponse(appealType, refId, mockGetQuestionResponse.answers)
		);

		expect(next).toHaveBeenCalled();
	});

	it('should handle errors and set res.locals.journeyResponse with a default response', async () => {
		getLPAUserFromSession.mockReturnValue(mockUser);
		getAppealByLPACodeAndId.mockResolvedValue(mockAppeal);
		getQuestionResponse.mockRejectedValue(new Error('Your error message'));

		await getJourneyResponse()(req, res, next);

		expect(getQuestionResponse).toHaveBeenCalledWith(appealType, refId);

		expect(res.locals.journeyResponse).toBeInstanceOf(JourneyResponse);

		expect(next).toHaveBeenCalled();
	});

	it('should throw error if unknown appealType', async () => {
		getLPAUserFromSession.mockReturnValue(mockUser);
		getAppealByLPACodeAndId.mockResolvedValue({ appealType: 'nope' });

		await expect(getJourneyResponse()(req, res, next)).rejects.toThrowError('');

		expect(getQuestionResponse).not.toHaveBeenCalled();
		expect(next).not.toHaveBeenCalled();
	});
});
