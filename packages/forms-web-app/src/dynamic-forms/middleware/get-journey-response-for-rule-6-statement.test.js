const getJourneyResponse = require('./get-journey-response-for-rule-6-statement');
const { JourneyResponse } = require('../journey-response');
const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');
const { mapDBResponseToJourneyResponseFormat } = require('./utils');
const { ApiClientError } = require('@pins/common/src/client/api-client-error.js');
const {
	isRule6StatementOpen
} = require('@pins/business-rules/src/rules/appeal-case/case-due-dates');

jest.mock('./utils');
jest.mock('@pins/business-rules/src/rules/appeal-case/case-due-dates');

describe('getJourneyResponseForRule6Statement', () => {
	let req, res, next;
	const refId = 'ref';
	const lpaCode = 'Q9999';
	const mockAppeal = { LPACode: lpaCode };
	const testDBResponse = { answer1: '1', AppealCase: { LPACode: lpaCode } };

	beforeEach(() => {
		jest.clearAllMocks();
		req = {
			params: { referenceId: refId },
			session: { navigationHistory: [''] },
			appealsApiClient: {
				getAppealCaseByCaseRef: jest.fn().mockResolvedValue(mockAppeal),
				getRule6StatementSubmission: jest.fn(),
				postRule6StatementSubmission: jest.fn()
			}
		};
		res = {
			status: jest.fn().mockReturnValue(res),
			render: jest.fn().mockReturnValue(res),
			locals: {},
			redirect: jest.fn().mockReturnValue(res)
		};
		next = jest.fn();
		isRule6StatementOpen.mockReturnValue(true);
	});

	it('should set res.locals.journeyResponse with a successful response', async () => {
		req.appealsApiClient.getRule6StatementSubmission.mockResolvedValue(testDBResponse);
		mapDBResponseToJourneyResponseFormat.mockReturnValue(testDBResponse);

		await getJourneyResponse()(req, res, next);

		expect(req.appealsApiClient.getRule6StatementSubmission).toHaveBeenCalledWith(refId);
		expect(res.locals.journeyResponse).toEqual(
			new JourneyResponse(JOURNEY_TYPES.RULE_6_STATEMENT.id, refId, testDBResponse, lpaCode)
		);
		expect(next).toHaveBeenCalled();
	});

	it('should handle errors and set res.locals.journeyResponse with a default response', async () => {
		req.appealsApiClient.getRule6StatementSubmission.mockRejectedValue(new Error('fail'));

		await getJourneyResponse()(req, res, next);

		expect(res.locals.journeyResponse).toBeInstanceOf(JourneyResponse);
		expect(res.locals.journeyResponse.LPACode).toEqual(lpaCode);
		expect(next).toHaveBeenCalled();
	});

	it('should create submission if not found (404)', async () => {
		req.appealsApiClient.getRule6StatementSubmission.mockRejectedValue(
			new ApiClientError('not found', 404, [])
		);

		await getJourneyResponse()(req, res, next);

		expect(req.appealsApiClient.postRule6StatementSubmission).toHaveBeenCalledWith(refId);
		expect(res.locals.journeyResponse).toBeInstanceOf(JourneyResponse);
		expect(next).toHaveBeenCalled();
	});

	it('should redirect if not open and checkSubmitted is true', async () => {
		isRule6StatementOpen.mockReturnValue(false);
		await getJourneyResponse(true)(req, res, next);

		expect(res.redirect).toHaveBeenCalled();
	});
});
