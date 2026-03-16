const getJourneyResponseForAppellant = require('./get-journey-response-for-appellant');
const { JourneyResponse } = require('@pins/dynamic-forms/src/journey-response');
const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');
const { ApiClientError } = require('@pins/common/src/client/api-client-error.js');
const { mapDBResponseToJourneyResponseFormat } = require('./utils');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const { FLAG } = require('@pins/common/src/feature-flags');

jest.mock('./utils');
jest.mock('../../featureFlag', () => ({
	isFeatureActive: jest.fn()
}));

describe('getJourneyResponseForAppellant', () => {
	let req, res, next;
	const submissionId = 'sub-123';
	const lpaCode = 'Q9999';
	const appealTypeCode = CASE_TYPES.HAS.processCode;
	const mockSubmission = {
		id: submissionId,
		LPACode: lpaCode,
		appealTypeCode
	};
	const convertedResponse = { foo: 'bar' };

	beforeEach(() => {
		req = {
			query: { id: submissionId },
			appealsApiClient: {
				getAppellantSubmission: jest.fn()
			}
		};
		res = {
			status: jest.fn().mockReturnThis(),
			render: jest.fn().mockReturnThis(),
			locals: {}
		};
		next = jest.fn();
		mapDBResponseToJourneyResponseFormat.mockReturnValue(convertedResponse);
		require('../../featureFlag').isFeatureActive.mockResolvedValue(true);
	});

	it('should 404 if submissionId is invalid', async () => {
		req.query.id = undefined;
		await getJourneyResponseForAppellant(req, res, next);
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.render).toHaveBeenCalledWith('error/not-found');
		expect(next).not.toHaveBeenCalled();
	});

	it('should 404 if submission not found (ApiClientError 404)', async () => {
		req.appealsApiClient.getAppellantSubmission.mockRejectedValue(
			new ApiClientError('not found', 404, [])
		);
		await getJourneyResponseForAppellant(req, res, next);
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.render).toHaveBeenCalledWith('error/not-found');
		expect(next).not.toHaveBeenCalled();
	});

	it('should 404 if feature flag is not active', async () => {
		const submission = structuredClone(mockSubmission);
		submission.appealTypeCode = CASE_TYPES.ENFORCEMENT.processCode;
		req.appealsApiClient.getAppellantSubmission.mockResolvedValue(submission);

		require('../../featureFlag').isFeatureActive.mockResolvedValue(false);
		await getJourneyResponseForAppellant(req, res, next);
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.render).toHaveBeenCalledWith('error/not-found');
		expect(next).not.toHaveBeenCalled();
	});

	it('should set journeyResponse and call next on success', async () => {
		req.appealsApiClient.getAppellantSubmission.mockResolvedValue(mockSubmission);
		require('../../featureFlag').isFeatureActive.mockResolvedValue(true);

		await getJourneyResponseForAppellant(req, res, next);

		const expectedType = JOURNEY_TYPES.HAS_APPEAL_FORM.id;

		expect(res.locals.journeyResponse).toEqual(
			expect.objectContaining(
				new JourneyResponse(expectedType, submissionId, convertedResponse, lpaCode)
			)
		);
		expect(res.locals.journeyResponse.expeditedAppealsEnabled).toBe(true);
		expect(require('../../featureFlag').isFeatureActive).toHaveBeenCalledWith(
			FLAG.EXPEDITED_APPEALS_FO_V1,
			lpaCode
		);
		expect(next).toHaveBeenCalled();
	});

	it('should set expeditedAppealsEnabled true for S78 when expedited flag is active', async () => {
		req.appealsApiClient.getAppellantSubmission.mockResolvedValue({
			...mockSubmission,
			appealTypeCode: CASE_TYPES.S78.processCode
		});
		require('../../featureFlag').isFeatureActive.mockImplementation(async (flagName) => {
			if (flagName === FLAG.EXPEDITED_APPEALS_FO_V1) {
				return true;
			}
			return true;
		});

		await getJourneyResponseForAppellant(req, res, next);

		expect(res.locals.journeyResponse.expeditedAppealsEnabled).toBe(true);
		expect(require('../../featureFlag').isFeatureActive).toHaveBeenCalledWith(
			FLAG.EXPEDITED_APPEALS_FO_V1,
			lpaCode
		);
		expect(next).toHaveBeenCalled();
	});

	it('should set expeditedAppealsEnabled false when expedited flag is inactive', async () => {
		req.appealsApiClient.getAppellantSubmission.mockResolvedValue(mockSubmission);
		require('../../featureFlag').isFeatureActive.mockImplementation(async (flagName) => {
			if (flagName === FLAG.EXPEDITED_APPEALS_FO_V1) {
				return false;
			}
			return true;
		});

		await getJourneyResponseForAppellant(req, res, next);

		expect(res.locals.journeyResponse.expeditedAppealsEnabled).toBe(false);
		expect(require('../../featureFlag').isFeatureActive).toHaveBeenCalledWith(
			FLAG.EXPEDITED_APPEALS_FO_V1,
			lpaCode
		);
		expect(next).toHaveBeenCalled();
	});
});
