const getJourneyResponse = require('./get-journey-response-for-lpa');
const { JourneyResponse } = require('../journey-response');
const { getUserFromSession } = require('../../services/user.service');
const { LPA_JOURNEY_TYPES_FORMATTED } = require('../journey-factory');
const { mapDBResponseToJourneyResponseFormat } = require('./utils');
const { ApiClientError } = require('@pins/common/src/client/api-client-error.js');
const { LPA_USER_ROLE } = require('@pins/common/src/constants');

jest.mock('../../services/user.service');
jest.mock('./utils');

describe('getJourneyResponse', () => {
	let req, res, next;
	const testLPACode = 'Q9999';
	const noneTestLPACode = 'Q1111';
	const refId = 'ref';
	const mockValidTestLpaUser = { id: '123', lpaCode: testLPACode };
	const mockValidNotTestLpaUser = { lpaCode: noneTestLPACode };
	const invalidLpaUser = {};
	const mockAppeal = { appealTypeCode: 'HAS', lpaQuestionnaireDueDate: new Date() };
	const testDBResponse = { answer1: '1', AppealCase: { LPACode: testLPACode } };

	beforeEach(() => {
		req = {
			params: {
				referenceId: refId
			},
			session: {
				navigationHistory: ['']
			}
		};

		req.appealsApiClient = {
			getUsersAppealCase: jest.fn(),
			getLPAQuestionnaire: jest.fn(),
			postLPAQuestionnaire: jest.fn()
		};

		const mockResponse = () => {
			const res = {};
			res.status = jest.fn().mockReturnValue(res);
			res.json = jest.fn().mockReturnValue(res);
			res.render = jest.fn().mockReturnValue(res);
			res.locals = jest.fn().mockReturnValue(res);
			res.sendStatus = jest.fn().mockReturnValue(res);
			res.status = jest.fn().mockReturnValue(res);
			res.redirect = jest.fn().mockReturnValue(res);
			return res;
		};
		res = mockResponse();
		next = jest.fn();
		jest.clearAllMocks();
	});

	it('should set res.locals.journeyResponse with a successful response', async () => {
		getUserFromSession.mockReturnValue(mockValidTestLpaUser);

		req.appealsApiClient.getUsersAppealCase.mockImplementation(() => Promise.resolve(mockAppeal));
		req.appealsApiClient.getLPAQuestionnaire.mockResolvedValue(testDBResponse);
		mapDBResponseToJourneyResponseFormat.mockReturnValue(testDBResponse);

		await getJourneyResponse()(req, res, next);

		expect(getUserFromSession).toHaveBeenCalledWith(req);
		expect(req.appealsApiClient.getUsersAppealCase).toHaveBeenCalledWith({
			caseReference: 'ref',
			userId: mockValidTestLpaUser.id,
			role: LPA_USER_ROLE
		});
		expect(req.appealsApiClient.getLPAQuestionnaire).toHaveBeenCalledWith(refId);
		expect(res.locals.journeyResponse).toEqual(
			new JourneyResponse(
				LPA_JOURNEY_TYPES_FORMATTED[mockAppeal.appealTypeCode],
				refId,
				testDBResponse,
				testLPACode
			)
		);
		expect(next).toHaveBeenCalled();
	});

	it('should handle errors and set res.locals.journeyResponse with a default response', async () => {
		getUserFromSession.mockReturnValue(mockValidTestLpaUser);
		req.appealsApiClient.getUsersAppealCase.mockImplementation(() => Promise.resolve(mockAppeal));
		req.appealsApiClient.getLPAQuestionnaire.mockRejectedValue(new Error('Your error message'));

		await getJourneyResponse()(req, res, next);

		expect(req.appealsApiClient.getLPAQuestionnaire).toHaveBeenCalledWith(refId);
		expect(res.locals.journeyResponse).toBeInstanceOf(JourneyResponse);
		expect(res.locals.journeyResponse.LPACode).toEqual(mockValidTestLpaUser.lpaCode);
		expect(next).toHaveBeenCalled();
	});

	it('should handle errors and create questionnaire if not found', async () => {
		getUserFromSession.mockReturnValue(mockValidTestLpaUser);
		req.appealsApiClient.getUsersAppealCase.mockImplementation(() => Promise.resolve(mockAppeal));
		req.appealsApiClient.getLPAQuestionnaire.mockRejectedValue(
			new ApiClientError('not found', 404, [])
		);

		await getJourneyResponse()(req, res, next);

		expect(req.appealsApiClient.getLPAQuestionnaire).toHaveBeenCalledWith(refId);
		expect(res.locals.journeyResponse).toBeInstanceOf(JourneyResponse);
		expect(res.locals.journeyResponse.LPACode).toEqual(mockValidTestLpaUser.lpaCode);
		expect(req.appealsApiClient.postLPAQuestionnaire).toHaveBeenCalledWith(refId);
		expect(next).toHaveBeenCalled();
	});

	it('should redirect user to dashboard if lpaq not open', async () => {
		getUserFromSession.mockReturnValue(mockValidNotTestLpaUser);
		req.appealsApiClient.getUsersAppealCase.mockImplementation(() =>
			Promise.resolve({ ...mockAppeal, lpaQuestionnaireSubmittedDate: new Date() })
		);

		await getJourneyResponse()(req, res, next);

		expect(res.redirect).toHaveBeenCalled();
	});

	it('should not redirect user if lpaq not open but checkSubmitted is false', async () => {
		getUserFromSession.mockReturnValue(mockValidNotTestLpaUser);
		req.appealsApiClient.getUsersAppealCase.mockImplementation(() =>
			Promise.resolve({ ...mockAppeal, lpaQuestionnaireSubmittedDate: new Date() })
		);

		await getJourneyResponse(false)(req, res, next);

		expect(res.redirect).not.toHaveBeenCalled();
	});

	it('should return a 404 not found response if user lpa does not match', async () => {
		getUserFromSession.mockReturnValue(mockValidNotTestLpaUser);
		req.appealsApiClient.getUsersAppealCase.mockImplementation(() => Promise.resolve(mockAppeal));
		req.appealsApiClient.getLPAQuestionnaire.mockResolvedValue(testDBResponse);
		mapDBResponseToJourneyResponseFormat.mockReturnValue(testDBResponse);

		await getJourneyResponse()(req, res, next);

		expect(req.appealsApiClient.getLPAQuestionnaire).toHaveBeenCalledWith(refId);
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.render).toHaveBeenCalledWith('error/not-found');
	});

	it('should return a 404 not found response if user lpa not set', async () => {
		getUserFromSession.mockReturnValue(invalidLpaUser);
		req.appealsApiClient.getUsersAppealCase.mockImplementation(() => Promise.resolve(mockAppeal));
		req.appealsApiClient.getLPAQuestionnaire.mockResolvedValue(testDBResponse);
		mapDBResponseToJourneyResponseFormat.mockReturnValue(testDBResponse);

		await getJourneyResponse()(req, res, next);

		expect(req.appealsApiClient.getLPAQuestionnaire).toHaveBeenCalledWith(refId);
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.render).toHaveBeenCalledWith('error/not-found');
	});

	it('should throw error if unknown appealType', async () => {
		getUserFromSession.mockReturnValue(mockValidTestLpaUser);
		req.appealsApiClient.getUsersAppealCase.mockImplementation(() =>
			Promise.resolve({ appealTypeCode: 'nope', lpaQuestionnaireDueDate: new Date() })
		);

		await expect(getJourneyResponse()(req, res, next)).rejects.toThrowError('');

		expect(req.appealsApiClient.getLPAQuestionnaire).not.toHaveBeenCalled();
		expect(next).not.toHaveBeenCalled();
	});
});
