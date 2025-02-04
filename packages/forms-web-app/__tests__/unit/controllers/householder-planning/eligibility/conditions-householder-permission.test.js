const v8 = require('v8');
const appeal = require('../../../../mockData/householder-appeal');

const {
	getConditionsHouseholderPermission,
	postConditionsHouseholderPermission
} = require('../../../../../src/controllers/householder-planning/eligibility/conditions-householder-permission');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const { mockReq, mockRes } = require('../../../mocks');
const {
	VIEW: {
		HOUSEHOLDER_PLANNING: {
			ELIGIBILITY: { CONDITIONS_HOUSEHOLDER_PERMISSION }
		}
	}
} = require('../../../../../src/lib/views');
const config = require('../../../../../src/config');
const { isLpaInFeatureFlag } = require('#lib/is-lpa-in-feature-flag');

jest.mock('../../../../../src/lib/is-lpa-in-feature-flag');
jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/services/task.service');

describe('controllers/householder-planning/eligibility/conditions-householder-permission', () => {
	let req;
	let res;

	const sectionName = 'eligibility';
	const errors = { 'conditions-householder-permission': 'Select an option' };
	const errorSummary = [{ text: 'There was an error', href: '#' }];

	beforeEach(() => {
		req = v8.deserialize(
			v8.serialize({
				...mockReq(appeal),
				body: {}
			})
		);
		res = mockRes();
		jest.resetAllMocks();
	});

	describe('getConditionsHouseholderPermission', () => {
		it('should call the correct template', () => {
			getConditionsHouseholderPermission(req, res);

			expect(res.render).toHaveBeenCalledWith(CONDITIONS_HOUSEHOLDER_PERMISSION, {
				bannerHtmlOverride: config.betaBannerText,
				hasHouseholderPermissionConditions: true
			});
		});
	});

	describe('postConditionsHouseholderPermission', () => {
		it('should re-render the template with errors if submission validation fails', async () => {
			req = {
				...req,
				body: {
					'conditions-householder-permission': null,
					errors,
					errorSummary
				}
			};

			await postConditionsHouseholderPermission(req, res);

			expect(res.redirect).not.toHaveBeenCalled();
			expect(res.render).toHaveBeenCalledWith(CONDITIONS_HOUSEHOLDER_PERMISSION, {
				bannerHtmlOverride: config.betaBannerText,
				errors,
				errorSummary
			});
		});

		it('should re-render the template with errors if an error is thrown', async () => {
			const error = new Error('Internal Server Error');

			req = {
				...req,
				body: {
					'conditions-householder-permission': 'yes'
				}
			};

			createOrUpdateAppeal.mockImplementation(() => {
				throw error;
			});

			await postConditionsHouseholderPermission(req, res);

			expect(res.redirect).not.toHaveBeenCalled();
			expect(res.render).toHaveBeenCalledWith(CONDITIONS_HOUSEHOLDER_PERMISSION, {
				bannerHtmlOverride: config.betaBannerText,
				hasHouseholderPermissionConditions: true,
				errors: {},
				errorSummary: [{ text: error.toString(), href: '#' }]
			});
		});

		it('should redirect to the correct page if `yes` has been selected', async () => {
			const appealDeepCopy = JSON.parse(JSON.stringify(appeal));
			appealDeepCopy[sectionName].hasHouseholderPermissionConditions = true;
			appealDeepCopy.appealType = '1001';

			const submittedAppeal = {
				...appealDeepCopy,
				state: 'SUBMITTED'
			};

			createOrUpdateAppeal.mockReturnValue(submittedAppeal);

			req = {
				...req,
				body: {
					'conditions-householder-permission': 'yes'
				}
			};

			await postConditionsHouseholderPermission(req, res);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
			expect(res.redirect).toHaveBeenCalledWith('/before-you-start/listed-building-householder');
			expect(req.session.appeal).toEqual(submittedAppeal);
		});

		it('should redirect to the correct page if `no` has been selected - v1', async () => {
			appeal[sectionName].hasHouseholderPermissionConditions = false;
			appeal.appealType = '1005';

			const submittedAppeal = {
				...appeal,
				state: 'SUBMITTED'
			};

			createOrUpdateAppeal.mockReturnValue(submittedAppeal);

			req = {
				...req,
				body: {
					'conditions-householder-permission': 'no'
				}
			};

			await postConditionsHouseholderPermission(req, res);

			expect(res.redirect).toHaveBeenCalledWith('/before-you-start/any-of-following');
			expect(req.session.appeal).toEqual(submittedAppeal);
		});

		it('should redirect to the correct page if `no` has been selected - v2', async () => {
			isLpaInFeatureFlag.mockReturnValueOnce(true);
			appeal[sectionName].hasHouseholderPermissionConditions = false;
			appeal.appealType = '1005';

			const submittedAppeal = {
				...appeal,
				state: 'SUBMITTED'
			};

			createOrUpdateAppeal.mockReturnValue(submittedAppeal);

			req = {
				...req,
				body: {
					'conditions-householder-permission': 'no'
				}
			};

			await postConditionsHouseholderPermission(req, res);

			expect(res.redirect).toHaveBeenCalledWith('/before-you-start/listed-building');
			expect(req.session.appeal).toEqual(submittedAppeal);
		});
	});
});
