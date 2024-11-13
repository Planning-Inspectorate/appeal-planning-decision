const appeal = require('../../../mockData/full-appeal');
const v8 = require('v8');
const {
	getPriorApprovalExistingHome,
	postPriorApprovalExistingHome
} = require('../../../../src/controllers/full-appeal/prior-approval-existing-home');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const { mockReq, mockRes } = require('../../mocks');
const {
	VIEW: {
		FULL_APPEAL: { PRIOR_APPROVAL_EXISTING_HOME }
	}
} = require('../../../../src/lib/views');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/services/task.service');
const config = require('../../../../src/config');

describe('controllers/full-appeal/submit-appeal/prior-approval-existing-home', () => {
	let req;
	let res;

	const sectionName = 'eligibility';
	const errors = { 'prior-approval-existing-home': 'Select an option' };
	const errorSummary = [{ text: 'There was an error', href: '#' }];
	let fullAppealCopy;

	beforeEach(() => {
		req = v8.deserialize(
			v8.serialize({
				...mockReq(appeal),
				body: {}
			})
		);
		res = mockRes();
		jest.resetAllMocks();
		fullAppealCopy = JSON.parse(JSON.stringify(appeal));
	});

	describe('getPriorApprovalExistingHome', () => {
		it('should call the correct template', () => {
			getPriorApprovalExistingHome(req, res);

			expect(res.render).toHaveBeenCalledWith(PRIOR_APPROVAL_EXISTING_HOME, {
				bannerHtmlOverride: config.betaBannerText,
				hasPriorApprovalForExistingHome: true
			});
		});
	});

	describe('postPriorApprovalExistingHome', () => {
		it('should re-render the template with errors if submission validation fails', async () => {
			req = {
				...req,
				body: {
					'prior-approval-existing-home': null,
					errors,
					errorSummary
				}
			};

			await postPriorApprovalExistingHome(req, res);

			expect(res.redirect).not.toHaveBeenCalled();
			expect(res.render).toHaveBeenCalledWith(PRIOR_APPROVAL_EXISTING_HOME, {
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
					'prior-approval-existing-home': 'yes'
				}
			};

			createOrUpdateAppeal.mockImplementation(() => {
				throw error;
			});

			await postPriorApprovalExistingHome(req, res);

			expect(res.redirect).not.toHaveBeenCalled();
			expect(res.render).toHaveBeenCalledWith(PRIOR_APPROVAL_EXISTING_HOME, {
				bannerHtmlOverride: config.betaBannerText,
				hasPriorApprovalForExistingHome: true,
				errors: {},
				errorSummary: [{ text: error.toString(), href: '#' }]
			});
		});

		it('should redirect to the correct page if `yes` has been selected', async () => {
			fullAppealCopy[sectionName].hasPriorApprovalForExistingHome = true;
			fullAppealCopy.appealType = '1001';

			const submittedAppeal = {
				...fullAppealCopy,
				state: 'SUBMITTED'
			};

			createOrUpdateAppeal.mockReturnValue(submittedAppeal);

			req = {
				...req,
				body: {
					'prior-approval-existing-home': 'yes'
				}
			};

			await postPriorApprovalExistingHome(req, res);

			// const appealCopy = JSON.parse(JSON.stringify(fullAppealCopy));
			fullAppealCopy.appealSiteSection.siteOwnership = {
				haveOtherOwnersBeenTold: null,
				ownsWholeSite: null
			};

			expect(createOrUpdateAppeal).toHaveBeenCalledWith(fullAppealCopy);
			expect(res.redirect).toHaveBeenCalledWith('/before-you-start/listed-building-householder');
			expect(req.session.appeal).toEqual(submittedAppeal);
		});

		it('should redirect to the correct page if `no` has been selected', async () => {
			fullAppealCopy[sectionName].hasPriorApprovalForExistingHome = false;
			fullAppealCopy.appealType = '1005';

			const submittedAppeal = {
				...fullAppealCopy,
				state: 'SUBMITTED'
			};

			createOrUpdateAppeal.mockReturnValue(submittedAppeal);

			req = {
				...req,
				body: {
					'prior-approval-existing-home': 'no'
				}
			};

			await postPriorApprovalExistingHome(req, res);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith(fullAppealCopy);
			expect(res.redirect).toHaveBeenCalledWith('/before-you-start/any-of-following');
			expect(req.session.appeal).toEqual(submittedAppeal);
		});
	});
});
