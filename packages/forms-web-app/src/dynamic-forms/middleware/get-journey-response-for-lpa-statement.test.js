const getJourneyResponse = require('./get-journey-response-for-lpa-statement');
const { JourneyResponse } = require('@pins/dynamic-forms/src/journey-response');
const { getUserFromSession } = require('../../services/user.service');
const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');
const { mapDBResponseToJourneyResponseFormat } = require('./utils');
const { isLPAStatementOpen } = require('@pins/business-rules/src/rules/appeal-case/case-due-dates');

jest.mock('../../services/user.service');
jest.mock('./utils');
jest.mock('@pins/business-rules/src/rules/appeal-case/case-due-dates');

describe('getJourneyResponseForLpaStatement', () => {
	let req, res, next;
	const refId = 'ref';
	const lpaCode = 'Q9999';
	const mockUser = { id: '123', lpaCode };
	const mockAppeal = { LPACode: lpaCode };
	const testDBResponse = { answer1: '1', AppealCase: { LPACode: lpaCode } };

	beforeEach(() => {
		jest.clearAllMocks();
		req = {
			params: { referenceId: refId },
			session: { navigationHistory: [''] },
			appealsApiClient: {
				getUsersAppealCase: jest.fn().mockResolvedValue(mockAppeal),
				getLPAStatement: jest.fn()
			}
		};
		res = {
			status: jest.fn().mockReturnValue(res),
			render: jest.fn().mockReturnValue(res),
			locals: {},
			redirect: jest.fn().mockReturnValue(res)
		};
		next = jest.fn();
		getUserFromSession.mockReturnValue(mockUser);
		isLPAStatementOpen.mockReturnValue(true);
	});

	it('should set res.locals.journeyResponse with a successful response', async () => {
		req.appealsApiClient.getLPAStatement.mockResolvedValue(testDBResponse);
		mapDBResponseToJourneyResponseFormat.mockReturnValue(testDBResponse);

		await getJourneyResponse()(req, res, next);

		expect(req.appealsApiClient.getLPAStatement).toHaveBeenCalledWith(refId);
		expect(res.locals.journeyResponse).toEqual(
			new JourneyResponse(JOURNEY_TYPES.LPA_STATEMENT.id, refId, testDBResponse, lpaCode)
		);
		expect(next).toHaveBeenCalled();
	});

	it('should handle errors and set res.locals.journeyResponse with a default response', async () => {
		req.appealsApiClient.getLPAStatement.mockRejectedValue(new Error('fail'));

		await getJourneyResponse()(req, res, next);

		expect(res.locals.journeyResponse).toBeInstanceOf(JourneyResponse);
		expect(res.locals.journeyResponse.LPACode).toEqual(lpaCode);
		expect(next).toHaveBeenCalled();
	});

	it('should return 404 if user lpa does not match', async () => {
		getUserFromSession.mockReturnValue({ id: '123', lpaCode: 'DIFFERENT' });
		req.appealsApiClient.getLPAStatement.mockResolvedValue(testDBResponse);
		mapDBResponseToJourneyResponseFormat.mockReturnValue(testDBResponse);

		await getJourneyResponse()(req, res, next);

		expect(res.status).toHaveBeenCalledWith(404);
	});

	it('should redirect if not open and checkSubmitted is true', async () => {
		isLPAStatementOpen.mockReturnValue(false);
		await getJourneyResponse(true)(req, res, next);

		expect(res.redirect).toHaveBeenCalled();
	});
});
