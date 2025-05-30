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
const { isLpaInFeatureFlag } = require('#lib/is-lpa-in-feature-flag');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/services/task.service');
jest.mock('../../../../src/lib/is-lpa-in-feature-flag');

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
				hasPriorApprovalForExistingHome: true,
				errors: {},
				errorSummary: [{ text: error.toString(), href: '#' }]
			});
		});

		it('should redirect to the correct page if `yes` has been selected - v1', async () => {
			isLpaInFeatureFlag.mockReturnValueOnce(false);
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

		it('should redirect to the correct page if `yes` has been selected - v2 (s20 flag)', async () => {
			isLpaInFeatureFlag.mockReturnValueOnce(true);
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
			expect(res.redirect).toHaveBeenCalledWith('/before-you-start/granted-or-refused-householder');
			expect(req.session.appeal).toEqual(submittedAppeal);
		});

		it('should redirect to the correct page if `no` has been selected - v1', async () => {
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

		it('should redirect to the correct page if `no` has been selected - v2, s78 flag', async () => {
			isLpaInFeatureFlag.mockReturnValueOnce(false); //s20
			isLpaInFeatureFlag.mockReturnValueOnce(true); //s78
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
			expect(res.redirect).toHaveBeenCalledWith('/before-you-start/listed-building');
			expect(req.session.appeal).toEqual(submittedAppeal);
		});

		it('should redirect to the correct page if `no` has been selected - v2, s20 flag', async () => {
			isLpaInFeatureFlag.mockReturnValueOnce(true); //s20
			isLpaInFeatureFlag.mockReturnValueOnce(false); //s78
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
			expect(res.redirect).toHaveBeenCalledWith('/before-you-start/granted-or-refused');
			expect(req.session.appeal).toEqual(submittedAppeal);
		});

		it('should redirect to the correct page if `no` has been selected - v2, s20 & s78 flag', async () => {
			isLpaInFeatureFlag.mockReturnValueOnce(true); //s20
			isLpaInFeatureFlag.mockReturnValueOnce(true); //s78
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
			expect(res.redirect).toHaveBeenCalledWith('/before-you-start/granted-or-refused');
			expect(req.session.appeal).toEqual(submittedAppeal);
		});
	});
});
