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

		it('re-renders with API error when createOrUpdateAppeal fails', async () => {
			req.body = {
				'application-number': 'APP-999'
			};

			const error = new Error('API down');
			createOrUpdateAppeal.mockRejectedValue(error);

			await postApplicationLookup(req, res);

			expect(logger.error).toHaveBeenCalledWith(error);
			expect(res.render).toHaveBeenCalledWith(APPLICATION_LOOKUP, {
				planningApplicationNumber: 'APP-999',
				errors: {},
				errorSummary: [{ text: error.toString(), href: '#' }]
			});
			expect(res.redirect).not.toHaveBeenCalled();
		});

		it('updates appeal and redirects to next page when valid', async () => {
			req.body = {
				'application-number': 'APP-456'
			};

			const updatedAppeal = { ...appeal, planningApplicationNumber: 'APP-456' };
			createOrUpdateAppeal.mockResolvedValue(updatedAppeal);

			await postApplicationLookup(req, res);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith(updatedAppeal);
			expect(res.redirect).toHaveBeenCalledWith('/before-you-start/type-of-planning-application');
		});
	});
});
