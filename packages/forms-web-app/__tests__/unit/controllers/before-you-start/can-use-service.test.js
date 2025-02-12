const fullAppeal = require('../../../mockData/full-appeal');
const householderAppeal = require('../../../mockData/householder-appeal');
const {
	getCanUseService
} = require('../../../../src/controllers/before-you-start/can-use-service');
const priorApprovalFPAppeal = require('../../../mockData/prior-approval/prior-approval-fp-route');
const priorApprovalHASAppeal = require('../../../mockData/prior-approval/prior-approval-has-route');
const removalOrVariationOfConditionsFPAppeal = require('../../../mockData/removal-or-variation-of-conditions/removal-or-variation-of-conditions-fp-route');
const removalOrVariationOfConditionsHASAppeal = require('../../../mockData/removal-or-variation-of-conditions/removal-or-variation-of-conditions-has-route');
const { getDepartmentFromId } = require('../../../../src/services/department.service');
const config = require('../../../../src/config');

const {
	VIEW: {
		HOUSEHOLDER_PLANNING: {
			ELIGIBILITY: {
				CAN_USE_SERVICE_HOUSEHOLDER: canUseServiceHouseholder,
				CAN_USE_SERVICE_PRIOR_APPROVAL: canUseServicePriorApprovalHouseholder,
				CAN_USE_SERVICE_REMOVAL_OR_VARIATION_OF_CONDITIONS:
					canUseServiceRemovalOrVariationOfConditionsHouseholder
			}
		},
		FULL_APPEAL: {
			CAN_USE_SERVICE_FULL_APPEAL: canUseServiceFullAppealUrl,
			CAN_USE_SERVICE_PRIOR_APPROVAL: canUseServicePriorApprovalFull,
			CAN_USE_SERVICE_REMOVAL_OR_VARIATION_OF_CONDITIONS:
				canUseServiceRemovalOrVariationOfConditionsFullAppeal
		}
	}
} = require('../../../../src/lib/views');
const { isLpaInFeatureFlag } = require('#lib/is-lpa-in-feature-flag');

jest.mock('../../../../src/services/department.service');
jest.mock('../../../../src/lib/is-lpa-in-feature-flag');

const { mockReq, mockRes } = require('../../mocks');

describe('controllers/before-you-start/can-use-service', () => {
	let req;
	let res;

	beforeEach(() => {
		jest.resetAllMocks();
		res = mockRes();
		getDepartmentFromId.mockImplementation(() => Promise.resolve({ name: 'Bradford' }));
	});

	describe('getCanUseService', () => {
		it('renders page - HAS - date of decision', async () => {
			req = mockReq(householderAppeal);

			await getCanUseService(req, res);

			expect(res.render).toHaveBeenCalledWith(canUseServiceHouseholder, {
				bannerHtmlOverride: config.betaBannerText,
				appealLPD: 'Bradford',
				applicationDecision: 'Granted with conditions',
				applicationType: 'Householder planning',
				claimingCosts: 'No',
				deadlineDate: { date: 4, day: 'Friday', month: 'November', year: 2022 },
				decisionDate: '04 May 2022',
				dateOfDecisionLabel: 'Date of decision',
				enforcementNotice: 'No',
				isListedBuilding: 'No',
				nextPageUrl: '/full-appeal/submit-appeal/planning-application-number'
			});
		});

		it('renders page - HAS - date decision due', async () => {
			const householderAppealNoDecisionReceived = { ...householderAppeal };
			householderAppealNoDecisionReceived.eligibility.applicationDecision = 'nodecisionreceived';
			req = mockReq(householderAppealNoDecisionReceived);

			await getCanUseService(req, res);

			expect(res.render).toHaveBeenCalledWith(canUseServiceHouseholder, {
				bannerHtmlOverride: config.betaBannerText,
				appealLPD: 'Bradford',
				applicationDecision: 'No decision received',
				applicationType: 'Householder planning',
				claimingCosts: 'No',
				deadlineDate: { date: 4, day: 'Friday', month: 'November', year: 2022 },
				decisionDate: '04 May 2022',
				dateOfDecisionLabel: 'Date decision due',
				enforcementNotice: 'No',
				isListedBuilding: 'No',
				nextPageUrl: '/full-appeal/submit-appeal/planning-application-number'
			});
		});
	});

	describe('getCanUseService - prior approval', () => {
		it('renders page - s78 - no prior approval - v1', async () => {
			req = mockReq(priorApprovalFPAppeal);

			await getCanUseService(req, res);

			expect(res.render).toHaveBeenCalledWith(canUseServicePriorApprovalFull, {
				bannerHtmlOverride: config.betaBannerText,
				appealLPD: 'Bradford',
				applicationDecision: 'Refused',
				applicationType: 'Prior approval',
				deadlineDate: { date: 20, day: 'Saturday', month: 'August', year: 2022 },
				decisionDate: '20 February 2022',
				enforcementNotice: 'No',
				dateOfDecisionLabel: 'Date of decision',
				hasPriorApprovalForExistingHome: 'No',
				isListedBuilding: 'No',
				nextPageUrl: '/full-appeal/submit-appeal/planning-application-number'
			});
		});

		it('renders page - s78 - no prior approval - v2', async () => {
			isLpaInFeatureFlag.mockReturnValueOnce(true);
			req = mockReq(priorApprovalFPAppeal);

			await getCanUseService(req, res);

			expect(res.render).toHaveBeenCalledWith(canUseServicePriorApprovalFull, {
				bannerHtmlOverride: config.betaBannerText,
				appealLPD: 'Bradford',
				applicationDecision: 'Refused',
				applicationType: 'Prior approval',
				deadlineDate: { date: 20, day: 'Saturday', month: 'August', year: 2022 },
				decisionDate: '20 February 2022',
				enforcementNotice: 'No',
				dateOfDecisionLabel: 'Date of decision',
				hasPriorApprovalForExistingHome: 'No',
				isListedBuilding: 'No',
				isV2: true,
				nextPageUrl: '/full-appeal/submit-appeal/planning-application-number'
			});
		});

		it('renders page - HAS - prior approval', async () => {
			req = mockReq(priorApprovalHASAppeal);

			await getCanUseService(req, res);

			expect(res.render).toHaveBeenCalledWith(canUseServicePriorApprovalHouseholder, {
				bannerHtmlOverride: config.betaBannerText,
				appealLPD: 'Bradford',
				applicationDecision: 'Refused',
				applicationType: 'Prior approval',
				deadlineDate: { date: 15, day: 'Sunday', month: 'May', year: 2022 },
				decisionDate: '20 February 2022',
				enforcementNotice: 'No',
				dateOfDecisionLabel: 'Date of decision',
				claimingCosts: 'No',
				hasPriorApprovalForExistingHome: 'Yes',
				isListedBuilding: 'No',
				nextPageUrl: '/appeal-householder-decision/planning-application-number'
			});
		});
	});

	describe('getCanUseService - removal or variation of conditions', () => {
		it('renders page - s78 - v1', async () => {
			req = mockReq(removalOrVariationOfConditionsFPAppeal);

			await getCanUseService(req, res);

			expect(res.render).toHaveBeenCalledWith(
				canUseServiceRemovalOrVariationOfConditionsFullAppeal,
				{
					bannerHtmlOverride: config.betaBannerText,
					appealLPD: 'Bradford',
					applicationDecision: 'Refused',
					applicationType: 'Removal or variation of conditions',
					deadlineDate: { date: 20, day: 'Saturday', month: 'August', year: 2022 },
					decisionDate: '20 February 2022',
					enforcementNotice: 'No',
					dateOfDecisionLabel: 'Date of decision',
					hasHouseholderPermissionConditions: 'No',
					isListedBuilding: 'No',
					nextPageUrl: '/full-appeal/submit-appeal/planning-application-number'
				}
			);
		});
		it('renders page - s78 - v2', async () => {
			isLpaInFeatureFlag.mockReturnValueOnce(true);
			req = mockReq(removalOrVariationOfConditionsFPAppeal);

			await getCanUseService(req, res);

			expect(res.render).toHaveBeenCalledWith(
				canUseServiceRemovalOrVariationOfConditionsFullAppeal,
				{
					bannerHtmlOverride: config.betaBannerText,
					appealLPD: 'Bradford',
					applicationDecision: 'Refused',
					applicationType: 'Removal or variation of conditions',
					deadlineDate: { date: 20, day: 'Saturday', month: 'August', year: 2022 },
					decisionDate: '20 February 2022',
					enforcementNotice: 'No',
					dateOfDecisionLabel: 'Date of decision',
					hasHouseholderPermissionConditions: 'No',
					isV2: true,
					isListedBuilding: 'No',
					nextPageUrl: '/full-appeal/submit-appeal/planning-application-number'
				}
			);
		});
		it('renders page - HAS', async () => {
			req = mockReq(removalOrVariationOfConditionsHASAppeal);

			await getCanUseService(req, res);

			expect(res.render).toHaveBeenCalledWith(
				canUseServiceRemovalOrVariationOfConditionsHouseholder,
				{
					bannerHtmlOverride: config.betaBannerText,
					appealLPD: 'Bradford',
					applicationDecision: 'Refused',
					applicationType: 'Removal or variation of conditions',
					deadlineDate: { date: 15, day: 'Sunday', month: 'May', year: 2022 },
					decisionDate: '20 February 2022',
					enforcementNotice: 'No',
					dateOfDecisionLabel: 'Date of decision',
					claimingCosts: 'No',
					hasHouseholderPermissionConditions: 'Yes',
					isListedBuilding: 'No',
					nextPageUrl: '/appeal-householder-decision/planning-application-number'
				}
			);
		});
	});

	describe('getCanUseService - s78', () => {
		it('renders page - s78 - date of decision - v1', async () => {
			req = mockReq(fullAppeal);

			await getCanUseService(req, res);

			expect(res.render).toHaveBeenCalledWith(canUseServiceFullAppealUrl, {
				bannerHtmlOverride: config.betaBannerText,
				appealLPD: 'Bradford',
				applicationDecision: 'Granted with conditions',
				applicationType: 'Full appeal',
				deadlineDate: { date: 4, day: 'Friday', month: 'November', year: 2022 },
				decisionDate: '04 May 2022',
				dateOfDecisionLabel: 'Date of decision',
				enforcementNotice: 'No',
				isListedBuilding: 'No',
				nextPageUrl: '/full-appeal/submit-appeal/planning-application-number'
			});
		});

		it('renders page - s78 - date of decision - v2', async () => {
			isLpaInFeatureFlag.mockReturnValueOnce(true);
			req = mockReq(fullAppeal);

			await getCanUseService(req, res);

			expect(res.render).toHaveBeenCalledWith(canUseServiceFullAppealUrl, {
				bannerHtmlOverride: config.betaBannerText,
				appealLPD: 'Bradford',
				applicationDecision: 'Granted with conditions',
				applicationType: 'Full appeal',
				deadlineDate: { date: 4, day: 'Friday', month: 'November', year: 2022 },
				decisionDate: '04 May 2022',
				dateOfDecisionLabel: 'Date of decision',
				enforcementNotice: 'No',
				isListedBuilding: 'No',
				isV2: true,
				nextPageUrl: '/full-appeal/submit-appeal/planning-application-number'
			});
		});

		it('renders page - s78 - date decision due - v1', async () => {
			const fullAppealNoDecisionReceived = { ...fullAppeal };
			fullAppealNoDecisionReceived.eligibility.applicationDecision = 'nodecisionreceived';
			req = mockReq(fullAppealNoDecisionReceived);

			await getCanUseService(req, res);

			expect(res.render).toHaveBeenCalledWith(canUseServiceFullAppealUrl, {
				bannerHtmlOverride: config.betaBannerText,
				appealLPD: 'Bradford',
				applicationDecision: 'No decision received',
				applicationType: 'Full appeal',
				deadlineDate: { date: 4, day: 'Friday', month: 'November', year: 2022 },
				decisionDate: '04 May 2022',
				dateOfDecisionLabel: 'Date decision due',
				enforcementNotice: 'No',
				isListedBuilding: 'No',
				nextPageUrl: '/full-appeal/submit-appeal/planning-application-number'
			});
		});

		it('renders page - s78 - date decision due - v2', async () => {
			isLpaInFeatureFlag.mockReturnValueOnce(true);
			const fullAppealNoDecisionReceived = { ...fullAppeal };
			fullAppealNoDecisionReceived.eligibility.applicationDecision = 'nodecisionreceived';
			req = mockReq(fullAppealNoDecisionReceived);

			await getCanUseService(req, res);

			expect(res.render).toHaveBeenCalledWith(canUseServiceFullAppealUrl, {
				bannerHtmlOverride: config.betaBannerText,
				appealLPD: 'Bradford',
				applicationDecision: 'No decision received',
				applicationType: 'Full appeal',
				deadlineDate: { date: 4, day: 'Friday', month: 'November', year: 2022 },
				decisionDate: '04 May 2022',
				dateOfDecisionLabel: 'Date decision due',
				enforcementNotice: 'No',
				isListedBuilding: 'No',
				isV2: true,
				nextPageUrl: '/full-appeal/submit-appeal/planning-application-number'
			});
		});
	});
	describe('getCanUseService - s20', () => {
		it('renders page - s20', async () => {
			const s20Appeal = {
				typeOfPlanningApplication: 'listed-building',
				lpaCode: 'E60000068',
				decisionDate: fullAppeal.decisionDate,
				eligibility: {
					applicationDecision: 'granted'
				}
			};
			req = mockReq(s20Appeal);

			await getCanUseService(req, res);

			expect(res.render).toHaveBeenCalledWith(canUseServiceFullAppealUrl, {
				bannerHtmlOverride: config.betaBannerText,
				appealLPD: 'Bradford',
				applicationDecision: 'Granted with conditions',
				applicationType: 'Listed building consent',
				deadlineDate: { date: 4, day: 'Friday', month: 'November', year: 2022 },
				decisionDate: '04 May 2022',
				dateOfDecisionLabel: 'Date of decision',
				enforcementNotice: 'No',
				isListedBuilding: null,
				nextPageUrl: '/listed-building/planning-application-number'
			});
		});
	});
});
