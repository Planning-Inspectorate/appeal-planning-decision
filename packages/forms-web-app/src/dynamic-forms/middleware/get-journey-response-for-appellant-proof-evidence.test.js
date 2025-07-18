const getJourneyResponse = require('./get-journey-response-for-appellant-proof-evidence');
const { JourneyResponse } = require('../journey-response');
const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');
const { mapDBResponseToJourneyResponseFormat } = require('./utils');
const { ApiClientError } = require('@pins/common/src/client/api-client-error.js');
const {
	isAppellantProofsOfEvidenceOpen
} = require('@pins/business-rules/src/rules/appeal-case/case-due-dates');

jest.mock('./utils');
jest.mock('@pins/business-rules/src/rules/appeal-case/case-due-dates');

describe('getJourneyResponseForAppellantProofEvidence', () => {
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
				getAppellantProofOfEvidenceSubmission: jest.fn(),
				postAppellantProofOfEvidenceSubmission: jest.fn()
			}
		};
		res = {
			status: jest.fn().mockReturnValue(res),
			render: jest.fn().mockReturnValue(res),
			locals: {},
			redirect: jest.fn().mockReturnValue(res)
		};
		next = jest.fn();
		isAppellantProofsOfEvidenceOpen.mockReturnValue(true);
	});

	it('should set res.locals.journeyResponse with a successful response', async () => {
		req.appealsApiClient.getAppellantProofOfEvidenceSubmission.mockResolvedValue(testDBResponse);
		mapDBResponseToJourneyResponseFormat.mockReturnValue(testDBResponse);

		await getJourneyResponse()(req, res, next);

		expect(req.appealsApiClient.getAppellantProofOfEvidenceSubmission).toHaveBeenCalledWith(refId);
		expect(res.locals.journeyResponse).toEqual(
			new JourneyResponse(JOURNEY_TYPES.APPELLANT_PROOF_EVIDENCE.id, refId, testDBResponse, lpaCode)
		);
		expect(next).toHaveBeenCalled();
	});

	it('should handle errors and set res.locals.journeyResponse with a default response', async () => {
		req.appealsApiClient.getAppellantProofOfEvidenceSubmission.mockRejectedValue(new Error('fail'));

		await getJourneyResponse()(req, res, next);

		expect(res.locals.journeyResponse).toBeInstanceOf(JourneyResponse);
		expect(res.locals.journeyResponse.LPACode).toEqual(lpaCode);
		expect(next).toHaveBeenCalled();
	});

	it('should create submission if not found (404)', async () => {
		req.appealsApiClient.getAppellantProofOfEvidenceSubmission.mockRejectedValue(
			new ApiClientError('not found', 404, [])
		);

		await getJourneyResponse()(req, res, next);

		expect(req.appealsApiClient.postAppellantProofOfEvidenceSubmission).toHaveBeenCalledWith(refId);
		expect(res.locals.journeyResponse).toBeInstanceOf(JourneyResponse);
		expect(next).toHaveBeenCalled();
	});

	it('should redirect if not open and checkSubmitted is true', async () => {
		isAppellantProofsOfEvidenceOpen.mockReturnValue(false);

		await getJourneyResponse(true)(req, res, next);

		expect(res.redirect).toHaveBeenCalled();
	});
});
