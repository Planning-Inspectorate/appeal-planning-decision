const getJourneyResponse = require('./get-journey-response-for-lpa');
const { getQuestionResponse } = require('../../lib/appeals-api-wrapper');
const { JourneyResponse } = require('../journey-response');
const { getAppealByLPACodeAndId } = require('../../lib/appeals-api-wrapper');
const { getLPAUserFromSession } = require('../../services/lpa-user.service');
const { JOURNEY_TYPES_FORMATTED } = require('../journey-factory');

jest.mock('../../lib/appeals-api-wrapper');
jest.mock('../../services/lpa-user.service');

describe('getJourneyResponse', () => {
	let req, res, next;
	const testLPACode = 'Q9999';
	const noneTestLPACode = 'Q1111';
	const refId = 'ref';
	const answers = { answer1: '1' };
	const mockValidTestLpaUser = { lpaCode: testLPACode };
	const mockValidNotTestLpaUser = { lpaCode: noneTestLPACode };
	const invalidLpaUser = {};
	const mockAppeal = { appealType: 'Householder (HAS) Appeal' };

	beforeEach(() => {
		req = {
			params: {
				referenceId: refId
			}
		};

		const mockResponse = () => {
			const res = {};
			res.status = jest.fn().mockReturnValue(res);
			res.json = jest.fn().mockReturnValue(res);
			res.render = jest.fn().mockReturnValue(res);
			res.locals = jest.fn().mockReturnValue(res);
			res.sendStatus = jest.fn().mockReturnValue(res);
			res.status = jest.fn().mockReturnValue(res);
			return res;
		};
		res = mockResponse();
		next = jest.fn();
		jest.clearAllMocks();
	});

	it('should set res.locals.journeyResponse with a successful response', async () => {
		getLPAUserFromSession.mockReturnValue(mockValidTestLpaUser);
		getAppealByLPACodeAndId.mockResolvedValue(mockAppeal);
		getQuestionResponse.mockResolvedValue({ answers: answers, LPACode: testLPACode });

		await getJourneyResponse()(req, res, next);

		expect(getLPAUserFromSession).toHaveBeenCalledWith(req);
		expect(getAppealByLPACodeAndId).toHaveBeenCalledWith(mockValidTestLpaUser.lpaCode, refId);
		expect(getQuestionResponse).toHaveBeenCalledWith(
			JOURNEY_TYPES_FORMATTED[mockAppeal.appealType],
			refId
		);

		expect(res.locals.journeyResponse).toEqual(
			new JourneyResponse(
				JOURNEY_TYPES_FORMATTED[mockAppeal.appealType],
				refId,
				answers,
				testLPACode
			)
		);

		expect(next).toHaveBeenCalled();
	});

	it('should handle errors and set res.locals.journeyResponse with a default response', async () => {
		getLPAUserFromSession.mockReturnValue(mockValidTestLpaUser);
		getAppealByLPACodeAndId.mockResolvedValue(mockAppeal);
		getQuestionResponse.mockRejectedValue(new Error('Your error message'));

		await getJourneyResponse()(req, res, next);

		expect(getQuestionResponse).toHaveBeenCalledWith(
			JOURNEY_TYPES_FORMATTED[mockAppeal.appealType],
			refId
		);

		expect(res.locals.journeyResponse).toBeInstanceOf(JourneyResponse);
		expect(res.locals.journeyResponse.LPACode).toEqual(mockValidTestLpaUser.lpaCode);

		expect(next).toHaveBeenCalled();
	});
	it('should return a 404 not found response if user lpa does not match', async () => {
		getLPAUserFromSession.mockReturnValue(mockValidNotTestLpaUser);
		getAppealByLPACodeAndId.mockResolvedValue(mockAppeal);
		getQuestionResponse.mockReturnValue({ answers: answers, LPACode: testLPACode });
		await getJourneyResponse()(req, res, next);

		expect(getQuestionResponse).toHaveBeenCalledWith(
			JOURNEY_TYPES_FORMATTED[mockAppeal.appealType],
			refId
		);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.render).toHaveBeenCalledWith('error/not-found');
	});

	it('should return a 404 not found response if user lpa not set', async () => {
		getLPAUserFromSession.mockReturnValue(invalidLpaUser);
		getAppealByLPACodeAndId.mockResolvedValue(mockAppeal);
		getQuestionResponse.mockReturnValue({ answers: answers, LPACode: testLPACode });
		await getJourneyResponse()(req, res, next);

		expect(getQuestionResponse).toHaveBeenCalledWith(
			JOURNEY_TYPES_FORMATTED[mockAppeal.appealType],
			refId
		);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.render).toHaveBeenCalledWith('error/not-found');
	});

	it('should throw error if unknown appealType', async () => {
		getLPAUserFromSession.mockReturnValue(mockValidTestLpaUser);
		getAppealByLPACodeAndId.mockResolvedValue({ appealType: 'nope' });

		await expect(getJourneyResponse()(req, res, next)).rejects.toThrowError('');

		expect(getQuestionResponse).not.toHaveBeenCalled();
		expect(next).not.toHaveBeenCalled();
	});
});
