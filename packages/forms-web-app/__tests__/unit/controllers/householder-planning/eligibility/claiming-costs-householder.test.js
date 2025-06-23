const appeal = require('@pins/business-rules/test/data/householder-appeal');
const {
	getClaimingCostsHouseholder,
	postClaimingCostsHouseholder
} = require('../../../../../src/controllers/householder-planning/eligibility/claiming-costs-householder');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const logger = require('../../../../../src/lib/logger');

const {
	VIEW: {
		HOUSEHOLDER_PLANNING: {
			ELIGIBILITY: { CLAIMING_COSTS }
		}
	}
} = require('../../../../../src/lib/views');
const { mockReq, mockRes } = require('../../../mocks');
const { isLpaInFeatureFlag } = require('#lib/is-lpa-in-feature-flag');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/lib/logger');
jest.mock('../../../../../src/services/department.service');
jest.mock('../../../../../src/lib/is-lpa-in-feature-flag');

describe('controllers/householder-planning/claiming-costs-householder', () => {
	let req;
	let res;

	beforeEach(() => {
		req = mockReq(appeal);
		res = mockRes();

		jest.resetAllMocks();
	});

	describe('getClaimingCostsHouseholder', () => {
		it('should redirect if using V2 form', async () => {
			isLpaInFeatureFlag.mockResolvedValueOnce(true);

			await getClaimingCostsHouseholder(req, res);

			expect(res.redirect).toHaveBeenCalledWith('/before-you-start/can-use-service');
		});

		it('should call the correct template on getClaimingCostsHouseholder', async () => {
			isLpaInFeatureFlag.mockResolvedValueOnce(false);

			await getClaimingCostsHouseholder(req, res);

			expect(res.render).toHaveBeenCalledWith(CLAIMING_COSTS, {
				isClaimingCosts: appeal.eligibility.isClaimingCosts
			});
		});
	});

	describe('postClaimingCostsHouseholder', () => {
		it(`should redirect to the use-a-different-service page if 'yes' is selected`, async () => {
			const mockRequest = {
				...req,
				body: { 'claiming-costs-householder': 'yes' }
			};

			await postClaimingCostsHouseholder(mockRequest, res);

			expect(appeal.eligibility.isClaimingCosts).toEqual(true);
			expect(createOrUpdateAppeal).toHaveBeenCalledWith({ ...appeal });

			expect(res.redirect).toHaveBeenCalledWith(`/before-you-start/use-existing-service-costs`);
		});

		it(`should redirect to the results-householder page if 'no' is selected`, async () => {
			const mockRequest = {
				...req,
				body: { 'claiming-costs-householder': 'no' }
			};

			await postClaimingCostsHouseholder(mockRequest, res);

			expect(appeal.eligibility.isClaimingCosts).toEqual(false);
			expect(createOrUpdateAppeal).toHaveBeenCalledWith({
				...appeal
			});

			expect(res.redirect).toHaveBeenCalledWith('/before-you-start/can-use-service');
		});

		it('should render errors on the page if there are validation errors', async () => {
			const mockRequest = {
				...req,
				body: {
					errors: {
						'claiming-costs-householder': {
							msg: 'Select yes if you are claiming costs as part of your appeal'
						}
					}
				}
			};

			await postClaimingCostsHouseholder(mockRequest, res);

			expect(createOrUpdateAppeal).not.toHaveBeenCalled();

			expect(res.render).toHaveBeenCalledWith(`${CLAIMING_COSTS}`, {
				isClaimingCosts: appeal.eligibility.isClaimingCosts,
				errors: {
					'claiming-costs-householder': {
						msg: 'Select yes if you are claiming costs as part of your appeal'
					}
				},
				errorSummary: []
			});
		});

		it('should re-render the template with errors if there is any api call error', async () => {
			const error = new Error('API is down');

			const mockRequest = {
				...req,
				body: { 'claiming-costs-householder': 'outline-planning' }
			};

			createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

			await postClaimingCostsHouseholder(mockRequest, res);

			expect(res.redirect).not.toHaveBeenCalled();
			expect(logger.error).toHaveBeenCalledWith(error);

			expect(res.render).toHaveBeenCalledWith(`${CLAIMING_COSTS}`, {
				isClaimingCosts: appeal.eligibility.isClaimingCosts,
				errors: {},
				errorSummary: [{ text: error.toString(), href: 'pageId' }]
			});
		});
	});
});
