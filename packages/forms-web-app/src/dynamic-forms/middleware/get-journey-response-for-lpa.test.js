const getJourneyResponse = require('./get-journey-response-for-lpa');
const { apiClient } = require('../../lib/appeals-api-client');
const { JourneyResponse } = require('../journey-response');
const { getAppealByLPACodeAndId } = require('../../lib/appeals-api-wrapper');
const { getLPAUserFromSession } = require('../../services/lpa-user.service');
const { JOURNEY_TYPES_FORMATTED } = require('../journey-factory');
const { mapDBResponseToJourneyResponseFormat } = require('./utils');
const { ApiClientError } = require('@pins/common/src/client/api-client-error.js');

jest.mock('../../lib/appeals-api-client');
jest.mock('../../lib/appeals-api-wrapper');
jest.mock('../../services/lpa-user.service');
jest.mock('./utils');

describe('getJourneyResponse', () => {
	let req, res, next;
	const testLPACode = 'Q9999';
	const noneTestLPACode = 'Q1111';
	const refId = 'ref';
	const mockValidTestLpaUser = { lpaCode: testLPACode };
	const mockValidNotTestLpaUser = { lpaCode: noneTestLPACode };
	const invalidLpaUser = {};
	const mockAppeal = { appealType: 'Householder (HAS) Appeal' };
	const testDBResponse = { answer1: '1', AppealCase: { LPACode: testLPACode } };

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
		apiClient.getLPAQuestionnaire.mockResolvedValue(testDBResponse);
		mapDBResponseToJourneyResponseFormat.mockReturnValue(testDBResponse);

		await getJourneyResponse()(req, res, next);

		expect(getLPAUserFromSession).toHaveBeenCalledWith(req);
		expect(getAppealByLPACodeAndId).toHaveBeenCalledWith(mockValidTestLpaUser.lpaCode, refId);
		expect(apiClient.getLPAQuestionnaire).toHaveBeenCalledWith(refId);
		expect(res.locals.journeyResponse).toEqual(
			new JourneyResponse(
				JOURNEY_TYPES_FORMATTED[mockAppeal.appealType],
				refId,
				testDBResponse,
				testLPACode
			)
		);
		expect(next).toHaveBeenCalled();
	});

	it('should handle errors and set res.locals.journeyResponse with a default response', async () => {
		getLPAUserFromSession.mockReturnValue(mockValidTestLpaUser);
		getAppealByLPACodeAndId.mockResolvedValue(mockAppeal);
		apiClient.getLPAQuestionnaire.mockRejectedValue(new Error('Your error message'));

		await getJourneyResponse()(req, res, next);

		expect(apiClient.getLPAQuestionnaire).toHaveBeenCalledWith(refId);
		expect(res.locals.journeyResponse).toBeInstanceOf(JourneyResponse);
		expect(res.locals.journeyResponse.LPACode).toEqual(mockValidTestLpaUser.lpaCode);
		expect(next).toHaveBeenCalled();
	});

	it('should handle errors and create questionnaire if not found', async () => {
		getLPAUserFromSession.mockReturnValue(mockValidTestLpaUser);
		getAppealByLPACodeAndId.mockResolvedValue(mockAppeal);
		apiClient.getLPAQuestionnaire.mockRejectedValue(new ApiClientError('not found', 404, []));

		await getJourneyResponse()(req, res, next);

		expect(apiClient.getLPAQuestionnaire).toHaveBeenCalledWith(refId);
		expect(res.locals.journeyResponse).toBeInstanceOf(JourneyResponse);
		expect(res.locals.journeyResponse.LPACode).toEqual(mockValidTestLpaUser.lpaCode);
		expect(apiClient.postLPAQuestionnaire).toHaveBeenCalledWith(refId);
		expect(next).toHaveBeenCalled();
	});

	it('should return a 404 not found response if user lpa does not match', async () => {
		getLPAUserFromSession.mockReturnValue(mockValidNotTestLpaUser);
		getAppealByLPACodeAndId.mockResolvedValue(mockAppeal);
		apiClient.getLPAQuestionnaire.mockResolvedValue(testDBResponse);
		mapDBResponseToJourneyResponseFormat.mockReturnValue(testDBResponse);

		await getJourneyResponse()(req, res, next);

		expect(apiClient.getLPAQuestionnaire).toHaveBeenCalledWith(refId);
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.render).toHaveBeenCalledWith('error/not-found');
	});

	it('should return a 404 not found response if user lpa not set', async () => {
		getLPAUserFromSession.mockReturnValue(invalidLpaUser);
		getAppealByLPACodeAndId.mockResolvedValue(mockAppeal);
		apiClient.getLPAQuestionnaire.mockResolvedValue(testDBResponse);
		mapDBResponseToJourneyResponseFormat.mockReturnValue(testDBResponse);

		await getJourneyResponse()(req, res, next);

		expect(apiClient.getLPAQuestionnaire).toHaveBeenCalledWith(refId);
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.render).toHaveBeenCalledWith('error/not-found');
	});

	it('should throw error if unknown appealType', async () => {
		getLPAUserFromSession.mockReturnValue(mockValidTestLpaUser);
		getAppealByLPACodeAndId.mockResolvedValue({ appealType: 'nope' });

		await expect(getJourneyResponse()(req, res, next)).rejects.toThrowError('');

		expect(apiClient.getLPAQuestionnaire).not.toHaveBeenCalled();
		expect(next).not.toHaveBeenCalled();
	});
});
