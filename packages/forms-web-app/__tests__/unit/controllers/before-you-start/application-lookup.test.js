const fullAppeal = require('@pins/business-rules/test/data/full-appeal');
const {
	getApplicationLookup,
	postApplicationLookup
} = require('../../../../src/controllers/before-you-start/application-lookup');
const {
	VIEW: {
		BEFORE_YOU_START: { APPLICATION_LOOKUP }
	}
} = require('../../../../src/lib/views');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const { isLpaInFeatureFlag } = require('#lib/is-lpa-in-feature-flag');
const logger = require('../../../../src/lib/logger');
const { mockReq, mockRes } = require('../../mocks');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/logger');
jest.mock('../../../../src/lib/is-lpa-in-feature-flag');
jest.mock('@pins/common/src/client/bops/bops-api-client', () => {
	return {
		BopsApiClient: jest.fn().mockImplementation(() => ({
			getPublicApplication: jest.fn()
		}))
	};
});
jest.mock('@pins/business-rules', () => ({
	mappings: {
		bops: {
			beforeYouStart: jest.fn()
		}
	}
}));

const { BopsApiClient } = require('@pins/common/src/client/bops/bops-api-client');
const { mappings } = require('@pins/business-rules');

describe('controllers/before-you-start/planning-application-lookup', () => {
	let req;
	let res;

	const appeal = {
		...fullAppeal,
		lpaCode: 'E9999',
		planningApplicationNumber: 'APP-123'
	};

	beforeEach(() => {
		req = mockReq(appeal);
		res = mockRes();
		jest.clearAllMocks();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	describe('getApplicationLookup', () => {
		it('redirects to next page when feature flag is off', async () => {
			isLpaInFeatureFlag.mockResolvedValue(false);

			await getApplicationLookup(req, res);

			expect(res.redirect).toHaveBeenCalledWith('/before-you-start/type-of-planning-application');
			expect(res.render).not.toHaveBeenCalled();
		});

		it('renders the view with existing planning application number when feature flag is on', async () => {
			isLpaInFeatureFlag.mockResolvedValue(true);

			await getApplicationLookup(req, res);

			expect(res.render).toHaveBeenCalledWith(APPLICATION_LOOKUP, {
				planningApplicationNumber: 'APP-123'
			});
		});
	});

	describe('postApplicationLookup', () => {
		let bopsClientInstance;

		beforeEach(() => {
			bopsClientInstance = {
				getPublicApplication: jest.fn()
			};
			BopsApiClient.mockImplementation(() => bopsClientInstance);
		});

		it('re-renders with validation errors when input is invalid', async () => {
			req.body = {
				'application-number': '',
				errors: { 'application-number': 'required' },
				errorSummary: [{ text: 'Enter your planning application number', href: '#' }]
			};

			await postApplicationLookup(req, res);

			expect(res.render).toHaveBeenCalledWith(APPLICATION_LOOKUP, {
				planningApplicationNumber: '',
				errors: { 'application-number': 'required' },
				errorSummary: [{ text: 'Enter your planning application number', href: '#' }]
			});
			expect(createOrUpdateAppeal).not.toHaveBeenCalled();
			expect(res.redirect).not.toHaveBeenCalled();
		});

		it('redirects to application-not-found when BopsApiClient fails', async () => {
			req.body = {
				'application-number': 'APP-999'
			};

			bopsClientInstance.getPublicApplication.mockRejectedValue(new Error('Not found'));

			await postApplicationLookup(req, res);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith(
				expect.objectContaining({
					planningApplicationNumber: 'APP-999'
				})
			);
			expect(res.redirect).toHaveBeenCalledWith('/before-you-start/application-not-found');
		});

		it('maps lookup data and updates appeal when valid', async () => {
			req.body = {
				'application-number': 'APP-456'
			};

			const lookupResult = {
				application: {
					type: { value: 'pp_full_householder' },
					decision: 'granted',
					determinedAt: '2024-01-01T00:00:00Z'
				}
			};
			bopsClientInstance.getPublicApplication.mockResolvedValue(lookupResult);

			const mappedLookupData = {
				typeOfPlanningApplication: 'householder-planning',
				eligibility: { applicationDecision: 'GRANTED' },
				decisionDate: new Date('2024-01-01T00:00:00Z')
			};
			mappings.bops.beforeYouStart.mockReturnValue(mappedLookupData);

			const updatedAppeal = {
				...appeal,
				planningApplicationNumber: 'APP-456',
				eligibility: { applicationDecision: 'GRANTED' },
				typeOfPlanningApplication: 'householder-planning',
				decisionDate: new Date('2024-01-01T00:00:00Z')
			};
			createOrUpdateAppeal.mockResolvedValue(updatedAppeal);

			await postApplicationLookup(req, res);

			expect(mappings.bops.beforeYouStart).toHaveBeenCalledWith(lookupResult);
			expect(createOrUpdateAppeal).toHaveBeenCalledWith(
				expect.objectContaining({
					planningApplicationNumber: 'APP-456',
					eligibility: expect.objectContaining({ applicationDecision: 'GRANTED' }),
					typeOfPlanningApplication: 'householder-planning',
					decisionDate: new Date('2024-01-01T00:00:00Z')
				})
			);
			expect(res.redirect).toHaveBeenCalledWith('/before-you-start/type-of-planning-application');
		});

		it('does not update appeal fields if mapping returns null', async () => {
			req.body = {
				'application-number': 'APP-789'
			};

			const lookupResult = { application: { type: { value: 'unknown' } } };
			bopsClientInstance.getPublicApplication.mockResolvedValue(lookupResult);

			mappings.bops.beforeYouStart.mockReturnValue(null);

			const updatedAppeal = { ...appeal, planningApplicationNumber: 'APP-789' };
			createOrUpdateAppeal.mockResolvedValue(updatedAppeal);

			await postApplicationLookup(req, res);

			expect(mappings.bops.beforeYouStart).toHaveBeenCalledWith(lookupResult);
			expect(createOrUpdateAppeal).toHaveBeenCalledWith(
				expect.objectContaining({
					planningApplicationNumber: 'APP-789'
				})
			);
			expect(res.redirect).toHaveBeenCalledWith('/before-you-start/type-of-planning-application');
		});

		it('re-renders with API error when createOrUpdateAppeal fails', async () => {
			req.body = {
				'application-number': 'APP-999'
			};

			const lookupResult = { application: { type: { value: 'pp_full_householder' } } };
			bopsClientInstance.getPublicApplication.mockResolvedValue(lookupResult);

			mappings.bops.beforeYouStart.mockReturnValue({
				typeOfPlanningApplication: 'householder-planning',
				eligibility: { applicationDecision: 'GRANTED' },
				decisionDate: new Date('2024-01-01T00:00:00Z')
			});

			const error = new Error('API down');
			createOrUpdateAppeal.mockRejectedValue(error);

			await postApplicationLookup(req, res);

			expect(logger.error).toHaveBeenCalledWith(
				error,
				'Could not create or update appeal after application lookup'
			);
			expect(res.render).toHaveBeenCalledWith(APPLICATION_LOOKUP, {
				planningApplicationNumber: 'APP-999',
				errors: {},
				errorSummary: [{ text: 'There was a problem', href: '#' }]
			});
			expect(res.redirect).not.toHaveBeenCalled();
		});
	});
});
