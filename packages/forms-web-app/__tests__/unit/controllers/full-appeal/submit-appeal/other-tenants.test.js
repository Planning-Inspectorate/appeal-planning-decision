const appeal = require('@pins/business-rules/test/data/full-appeal');
const v8 = require('v8');
const {
	getOtherTenants,
	postOtherTenants
} = require('../../../../../src/controllers/full-appeal/submit-appeal/other-tenants');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const { mockReq, mockRes } = require('../../../mocks');
const {
	VIEW: {
		FULL_APPEAL: { OTHER_TENANTS, TELLING_THE_TENANTS, VISIBLE_FROM_ROAD }
	}
} = require('../../../../../src/lib/views');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/services/task.service');

describe('controllers/full-appeal/submit-appeal/other-tenants', () => {
	let req;
	let res;

	const sectionName = 'appealSiteSection';
	const taskName = 'agriculturalHolding';
	const errors = { 'other-tenants': 'Select an option' };
	const errorSummary = [{ text: 'There was an error', href: '#' }];
	appeal.sectionStates.appealSiteSection.otherTenants = 'COMPLETED';

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

	describe('getOtherTenants', () => {
		it('should call the correct template', () => {
			getOtherTenants(req, res);

			expect(res.render).toHaveBeenCalledTimes(1);
			expect(res.render).toHaveBeenCalledWith(OTHER_TENANTS, {
				hasOtherTenants: true
			});
		});
	});

	describe('postOtherTenants', () => {
		it('should re-render the template with errors if submission validation fails', async () => {
			req = {
				...req,
				body: {
					'other-tenants': undefined,
					errors,
					errorSummary
				}
			};

			await postOtherTenants(req, res);

			expect(res.redirect).not.toHaveBeenCalled();
			expect(res.render).toHaveBeenCalledTimes(1);
			expect(res.render).toHaveBeenCalledWith(OTHER_TENANTS, {
				errors,
				errorSummary
			});
		});

		it('should re-render the template with errors if an error is thrown', async () => {
			const error = new Error('Internal Server Error');

			createOrUpdateAppeal.mockImplementation(() => {
				throw error;
			});

			await postOtherTenants(req, res);

			expect(res.redirect).not.toHaveBeenCalled();
			expect(res.render).toHaveBeenCalledTimes(1);
			expect(res.render).toHaveBeenCalledWith(OTHER_TENANTS, {
				hasOtherTenants: false,
				errors: {},
				errorSummary: [{ text: error.toString(), href: '#' }]
			});
		});

		it('should redirect to the correct page if `yes` has been selected', async () => {
			const submittedAppeal = {
				...appeal,
				state: 'SUBMITTED'
			};

			createOrUpdateAppeal.mockReturnValue(submittedAppeal);

			req = {
				...req,
				body: {
					'other-tenants': 'yes'
				}
			};

			await postOtherTenants(req, res);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
			expect(res.redirect).toHaveBeenCalledWith(`/${TELLING_THE_TENANTS}`);
			expect(req.session.appeal).toEqual(submittedAppeal);
		});

		it('should redirect to the correct page if `no` has been selected', async () => {
			const submittedAppeal = {
				...appeal,
				state: 'SUBMITTED'
			};
			submittedAppeal[sectionName][taskName].hasOtherTenants = false;

			createOrUpdateAppeal.mockReturnValue(submittedAppeal);

			req = {
				...req,
				body: {
					'other-tenants': 'no'
				}
			};

			await postOtherTenants(req, res);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
			expect(res.redirect).toHaveBeenCalledWith(`/${VISIBLE_FROM_ROAD}`);
			expect(req.session.appeal).toEqual(submittedAppeal);
		});
	});
});
