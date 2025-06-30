const {
	getCanUseService
} = require('../../../../src/controllers/before-you-start/can-use-service');
const priorApprovalFPAppeal = require('../../../mockData/prior-approval/prior-approval-fp-route');
const priorApprovalHASAppeal = require('../../../mockData/prior-approval/prior-approval-has-route');
const removalOrVariationOfConditionsFPAppeal = require('../../../mockData/removal-or-variation-of-conditions/removal-or-variation-of-conditions-fp-route');
const removalOrVariationOfConditionsHASAppeal = require('../../../mockData/removal-or-variation-of-conditions/removal-or-variation-of-conditions-has-route');
const { getDepartmentFromId } = require('../../../../src/services/department.service');
const {
	TYPE_OF_PLANNING_APPLICATION: { MINOR_COMMERCIAL_DEVELOPMENT }
} = require('@pins/business-rules/src/constants');
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
const { FLAG } = require('@pins/common/src/feature-flags');

jest.mock('../../../../src/services/department.service');
jest.mock('../../../../src/lib/is-lpa-in-feature-flag');

const { mockReq, mockRes } = require('../../mocks');
const config = require('../../../../src/config');

describe('controllers/before-you-start/can-use-service', () => {
	let req;
	let res;
	let fullAppeal;
	let householderAppeal;
	const bannerHtmlOverrideHAS =
		config.betaBannerText +
		config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl('HAS'));
	const bannerHtmlOverride =
		config.betaBannerText +
		config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl('S78'));

	beforeEach(() => {
		jest.isolateModules(() => {
			fullAppeal = require('../../../mockData/full-appeal');
			householderAppeal = require('../../../mockData/householder-appeal');
		});
		jest.resetAllMocks();
		res = mockRes();
		getDepartmentFromId.mockImplementation(() => Promise.resolve({ name: 'Bradford' }));
	});

	describe('getCanUseService', () => {
		it('renders page - HAS - date of decision', async () => {
			req = mockReq(householderAppeal);

			await getCanUseService(req, res);

			expect(res.render).toHaveBeenCalledWith(canUseServiceHouseholder, {
				appealLPD: 'Bradford',
				applicationDecision: 'Granted with conditions',
				applicationType: 'Householder planning',
				claimingCosts: 'No',
				deadlineDate: { date: 4, day: 'Friday', month: 'November', year: 2022 },
				decisionDate: '04 May 2022',
				dateOfDecisionLabel: 'Date of decision',
				enforcementNotice: 'No',
				isListedBuilding: 'No',
				nextPageUrl: '/full-appeal/submit-appeal/planning-application-number',
				changeLpaUrl: '/before-you-start/local-planning-authority',
				bannerHtmlOverride: bannerHtmlOverrideHAS
			});
		});

		it('renders page - HAS - date decision due', async () => {
			const householderAppealNoDecisionReceived = { ...householderAppeal };
			householderAppealNoDecisionReceived.eligibility.applicationDecision = 'nodecisionreceived';
			req = mockReq(householderAppealNoDecisionReceived);

			await getCanUseService(req, res);

			expect(res.render).toHaveBeenCalledWith(canUseServiceHouseholder, {
				appealLPD: 'Bradford',
				applicationDecision: 'No decision received',
				applicationType: 'Householder planning',
				claimingCosts: 'No',
				deadlineDate: { date: 4, day: 'Friday', month: 'November', year: 2022 },
				decisionDate: '04 May 2022',
				dateOfDecisionLabel: 'Date decision due',
				enforcementNotice: 'No',
				isListedBuilding: 'No',
				nextPageUrl: '/full-appeal/submit-appeal/planning-application-number',
				changeLpaUrl: '/before-you-start/local-planning-authority',
				bannerHtmlOverride: bannerHtmlOverrideHAS
			});
		});
		it('renders page - HAS - date decision due - v2 - s20 flag', async () => {
			isLpaInFeatureFlag.mockReturnValue(true);
			const householderAppealNoDecisionReceived = { ...householderAppeal };
			householderAppealNoDecisionReceived.eligibility.applicationDecision = 'nodecisionreceived';
			req = mockReq(householderAppealNoDecisionReceived);

			await getCanUseService(req, res);

			expect(res.render).toHaveBeenCalledWith(canUseServiceHouseholder, {
				appealLPD: 'Bradford',
				applicationDecision: 'No decision received',
				applicationType: 'Householder planning',
				claimingCosts: 'No',
				deadlineDate: { date: 4, day: 'Friday', month: 'November', year: 2022 },
				decisionDate: '04 May 2022',
				dateOfDecisionLabel: 'Date decision due',
				enforcementNotice: 'No',
				isListedBuilding: null,
				nextPageUrl: '/full-appeal/submit-appeal/email-address',
				changeLpaUrl: '/before-you-start/local-planning-authority',
				bannerHtmlOverride: bannerHtmlOverrideHAS
			});
		});

		it('renders page - HAS - date of decision - v2 - s20 flag', async () => {
			isLpaInFeatureFlag.mockReturnValue(true);
			req = mockReq(householderAppeal);

			await getCanUseService(req, res);

			expect(res.render).toHaveBeenCalledWith(canUseServiceHouseholder, {
				appealLPD: 'Bradford',
				applicationDecision: 'Granted with conditions',
				applicationType: 'Householder planning',
				claimingCosts: 'No',
				deadlineDate: { date: 4, day: 'Friday', month: 'November', year: 2022 },
				decisionDate: '04 May 2022',
				dateOfDecisionLabel: 'Date of decision',
				enforcementNotice: 'No',
				isListedBuilding: null,
				nextPageUrl: '/full-appeal/submit-appeal/email-address',
				changeLpaUrl: '/before-you-start/local-planning-authority',
				bannerHtmlOverride: bannerHtmlOverrideHAS
			});
		});
	});

	describe('getCanUseService - prior approval', () => {
		it('renders page - s78 - no prior approval - v1', async () => {
			req = mockReq(priorApprovalFPAppeal);

			await getCanUseService(req, res);

			expect(res.render).toHaveBeenCalledWith(canUseServicePriorApprovalFull, {
				appealLPD: 'Bradford',
				applicationDecision: 'Refused',
				applicationType: 'Prior approval',
				deadlineDate: { date: 20, day: 'Saturday', month: 'August', year: 2022 },
				decisionDate: '20 February 2022',
				enforcementNotice: 'No',
				dateOfDecisionLabel: 'Date of decision',
				hasPriorApprovalForExistingHome: 'No',
				isListedBuilding: 'No',
				nextPageUrl: '/full-appeal/submit-appeal/planning-application-number',
				changeLpaUrl: '/before-you-start/local-planning-authority'
			});
		});

		it('renders page - s78 - no prior approval - v2 - s78 flag', async () => {
			isLpaInFeatureFlag.mockReturnValueOnce(true); //s20
			isLpaInFeatureFlag.mockReturnValueOnce(false); //s78
			isLpaInFeatureFlag.mockReturnValueOnce(false); //CAS
			isLpaInFeatureFlag.mockReturnValueOnce(false); //HAS
			isLpaInFeatureFlag.mockReturnValueOnce(false); //s20
			isLpaInFeatureFlag.mockReturnValueOnce(true); //s78

			req = mockReq(priorApprovalFPAppeal);

			await getCanUseService(req, res);

			expect(res.render).toHaveBeenCalledWith(canUseServicePriorApprovalFull, {
				appealLPD: 'Bradford',
				applicationDecision: 'Refused',
				applicationType: 'Prior approval',
				deadlineDate: { date: 20, day: 'Saturday', month: 'August', year: 2022 },
				decisionDate: '20 February 2022',
				enforcementNotice: 'No',
				dateOfDecisionLabel: 'Date of decision',
				hasPriorApprovalForExistingHome: 'No',
				isListedBuilding: 'No',
				isV2forS78: true,
				nextPageUrl: '/full-appeal/submit-appeal/email-address',
				changeLpaUrl: '/before-you-start/local-planning-authority'
			});
		});

		it('renders page - s78 - no prior approval - v2 - s78 and s20 flag', async () => {
			isLpaInFeatureFlag.mockImplementation(() => {
				return true;
			});

			req = mockReq(priorApprovalFPAppeal);

			await getCanUseService(req, res);

			expect(res.render).toHaveBeenCalledWith(canUseServicePriorApprovalFull, {
				appealLPD: 'Bradford',
				applicationDecision: 'Refused',
				applicationType: 'Prior approval',
				deadlineDate: { date: 20, day: 'Saturday', month: 'August', year: 2022 },
				decisionDate: '20 February 2022',
				enforcementNotice: 'No',
				dateOfDecisionLabel: 'Date of decision',
				hasPriorApprovalForExistingHome: 'No',
				isListedBuilding: null,
				isV2forS78: true,
				changeLpaUrl: '/before-you-start/local-planning-authority',
				nextPageUrl: '/full-appeal/submit-appeal/email-address'
			});
		});

		it('renders page - HAS - prior approval', async () => {
			req = mockReq(priorApprovalHASAppeal);

			await getCanUseService(req, res);

			expect(res.render).toHaveBeenCalledWith(canUseServicePriorApprovalHouseholder, {
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
				changeLpaUrl: '/before-you-start/local-planning-authority',
				nextPageUrl: '/appeal-householder-decision/planning-application-number'
			});
		});

		it('renders page - HAS - prior approval - v2 - s20 flag', async () => {
			isLpaInFeatureFlag.mockImplementation(() => {
				return true;
			});

			req = mockReq(priorApprovalHASAppeal);

			await getCanUseService(req, res);
			expect(res.render).toHaveBeenCalledWith(canUseServicePriorApprovalHouseholder, {
				appealLPD: 'Bradford',
				applicationDecision: 'Refused',
				applicationType: 'Prior approval',
				deadlineDate: { date: 15, day: 'Sunday', month: 'May', year: 2022 },
				decisionDate: '20 February 2022',
				enforcementNotice: 'No',
				dateOfDecisionLabel: 'Date of decision',
				claimingCosts: 'No',
				hasPriorApprovalForExistingHome: 'Yes',
				isListedBuilding: null,
				changeLpaUrl: '/before-you-start/local-planning-authority',
				nextPageUrl: '/appeal-householder-decision/email-address'
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
					appealLPD: 'Bradford',
					applicationDecision: 'Refused',
					applicationType: 'Removal or variation of conditions',
					deadlineDate: { date: 20, day: 'Saturday', month: 'August', year: 2022 },
					decisionDate: '20 February 2022',
					enforcementNotice: 'No',
					dateOfDecisionLabel: 'Date of decision',
					hasHouseholderPermissionConditions: 'No',
					isListedBuilding: 'No',
					changeLpaUrl: '/before-you-start/local-planning-authority',
					nextPageUrl: '/full-appeal/submit-appeal/planning-application-number'
				}
			);
		});
		it('renders page - s78 - v2', async () => {
			isLpaInFeatureFlag.mockImplementation(() => {
				return true;
			});

			req = mockReq(removalOrVariationOfConditionsFPAppeal);

			await getCanUseService(req, res);

			expect(res.render).toHaveBeenCalledWith(
				canUseServiceRemovalOrVariationOfConditionsFullAppeal,
				{
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
					changeLpaUrl: '/before-you-start/local-planning-authority',
					nextPageUrl: '/full-appeal/submit-appeal/email-address'
				}
			);
		});
		it('renders page - HAS', async () => {
			req = mockReq(removalOrVariationOfConditionsHASAppeal);

			await getCanUseService(req, res);

			expect(res.render).toHaveBeenCalledWith(
				canUseServiceRemovalOrVariationOfConditionsHouseholder,
				{
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
					changeLpaUrl: '/before-you-start/local-planning-authority',
					nextPageUrl: '/appeal-householder-decision/planning-application-number'
				}
			);
		});
	});

	describe('getCanUseService - s78', () => {
		it('renders page - s78 - date of decision - v1', async () => {
			req = mockReq(fullAppeal);

			isLpaInFeatureFlag.mockImplementation(() => {
				return false;
			});

			await getCanUseService(req, res);

			expect(res.render).toHaveBeenCalledWith(canUseServiceFullAppealUrl, {
				appealLPD: 'Bradford',
				applicationAbout: null,
				applicationDecision: 'Granted with conditions',
				applicationType: 'Full appeal',
				deadlineDate: { date: 4, day: 'Friday', month: 'November', year: 2022 },
				decisionDate: '04 May 2022',
				dateOfDecisionLabel: 'Date of decision',
				enforcementNotice: 'No',
				isListedBuilding: 'No',
				changeLpaUrl: '/before-you-start/local-planning-authority',
				isV2forCAS: false,
				isV2forS78: false,
				nextPageUrl: '/full-appeal/submit-appeal/planning-application-number',
				bannerHtmlOverride
			});
		});

		it('renders page - s78 - date of decision - v2 - s78 flag', async () => {
			isLpaInFeatureFlag.mockImplementation((_, flag) => {
				return flag === FLAG.S78_APPEAL_FORM_V2;
			});

			req = mockReq(fullAppeal);

			await getCanUseService(req, res);

			expect(res.render).toHaveBeenCalledWith(canUseServiceFullAppealUrl, {
				appealLPD: 'Bradford',
				applicationAbout: null,
				applicationDecision: 'Granted with conditions',
				applicationType: 'Full appeal',
				deadlineDate: { date: 4, day: 'Friday', month: 'November', year: 2022 },
				decisionDate: '04 May 2022',
				dateOfDecisionLabel: 'Date of decision',
				enforcementNotice: 'No',
				isListedBuilding: 'No',
				isV2forCAS: false,
				isV2forS78: true,
				changeLpaUrl: '/before-you-start/local-planning-authority',
				nextPageUrl: '/full-appeal/submit-appeal/email-address',
				bannerHtmlOverride
			});
		});

		it('renders page - s78 - date of decision - v2 - s20 & s78 flag', async () => {
			isLpaInFeatureFlag.mockImplementation((_, flag) => {
				return flag === FLAG.S78_APPEAL_FORM_V2 || flag === FLAG.S20_APPEAL_FORM_V2;
			});
			req = mockReq(fullAppeal);

			await getCanUseService(req, res);

			expect(res.render).toHaveBeenCalledWith(canUseServiceFullAppealUrl, {
				appealLPD: 'Bradford',
				applicationAbout: null,
				applicationDecision: 'Granted with conditions',
				applicationType: 'Full appeal',
				deadlineDate: { date: 4, day: 'Friday', month: 'November', year: 2022 },
				decisionDate: '04 May 2022',
				dateOfDecisionLabel: 'Date of decision',
				enforcementNotice: 'No',
				isListedBuilding: null,
				isV2forCAS: false,
				isV2forS78: true,
				changeLpaUrl: '/before-you-start/local-planning-authority',
				nextPageUrl: '/full-appeal/submit-appeal/email-address',
				bannerHtmlOverride
			});
		});

		it('renders page - s78 - date decision due - v1', async () => {
			const fullAppealNoDecisionReceived = { ...fullAppeal };
			fullAppealNoDecisionReceived.eligibility.applicationDecision = 'nodecisionreceived';
			req = mockReq(fullAppealNoDecisionReceived);

			isLpaInFeatureFlag.mockImplementation(() => {
				return false;
			});

			await getCanUseService(req, res);

			expect(res.render).toHaveBeenCalledWith(canUseServiceFullAppealUrl, {
				appealLPD: 'Bradford',
				applicationAbout: null,
				applicationDecision: 'No decision received',
				applicationType: 'Full appeal',
				deadlineDate: { date: 4, day: 'Friday', month: 'November', year: 2022 },
				decisionDate: '04 May 2022',
				dateOfDecisionLabel: 'Date decision due',
				enforcementNotice: 'No',
				isListedBuilding: 'No',
				isV2forCAS: false,
				isV2forS78: false,
				nextPageUrl: '/full-appeal/submit-appeal/planning-application-number',
				changeLpaUrl: '/before-you-start/local-planning-authority',
				bannerHtmlOverride
			});
		});

		it('renders page - s78 - date decision due - v2 - s78 flag', async () => {
			isLpaInFeatureFlag.mockImplementation((_, flag) => {
				return flag === FLAG.S78_APPEAL_FORM_V2;
			});
			const fullAppealNoDecisionReceived = { ...fullAppeal };
			fullAppealNoDecisionReceived.eligibility.applicationDecision = 'nodecisionreceived';
			req = mockReq(fullAppealNoDecisionReceived);

			await getCanUseService(req, res);

			expect(res.render).toHaveBeenCalledWith(canUseServiceFullAppealUrl, {
				appealLPD: 'Bradford',
				applicationAbout: null,
				applicationDecision: 'No decision received',
				applicationType: 'Full appeal',
				deadlineDate: { date: 4, day: 'Friday', month: 'November', year: 2022 },
				decisionDate: '04 May 2022',
				dateOfDecisionLabel: 'Date decision due',
				enforcementNotice: 'No',
				isListedBuilding: 'No',
				isV2forCAS: false,
				isV2forS78: true,
				nextPageUrl: '/full-appeal/submit-appeal/email-address',
				changeLpaUrl: '/before-you-start/local-planning-authority',
				bannerHtmlOverride
			});
		});

		it('renders page - s78 - date decision due - v2 - s20 & s78 flag', async () => {
			isLpaInFeatureFlag.mockImplementation((_, flag) => {
				return flag === FLAG.S78_APPEAL_FORM_V2 || flag === FLAG.S20_APPEAL_FORM_V2;
			});
			const fullAppealNoDecisionReceived = { ...fullAppeal };
			fullAppealNoDecisionReceived.eligibility.applicationDecision = 'nodecisionreceived';
			req = mockReq(fullAppealNoDecisionReceived);

			await getCanUseService(req, res);

			expect(res.render).toHaveBeenCalledWith(canUseServiceFullAppealUrl, {
				appealLPD: 'Bradford',
				applicationAbout: null,
				applicationDecision: 'No decision received',
				applicationType: 'Full appeal',
				deadlineDate: { date: 4, day: 'Friday', month: 'November', year: 2022 },
				decisionDate: '04 May 2022',
				dateOfDecisionLabel: 'Date decision due',
				enforcementNotice: 'No',
				isListedBuilding: null,
				isV2forCAS: false,
				isV2forS78: true,
				changeLpaUrl: '/before-you-start/local-planning-authority',
				nextPageUrl: '/full-appeal/submit-appeal/email-address',
				bannerHtmlOverride
			});
		});
	});

	describe('getCanUseService - s20', () => {
		it('renders page - s20', async () => {
			isLpaInFeatureFlag.mockImplementation((_, flag) => {
				return flag === FLAG.S20_APPEAL_FORM_V2;
			});
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
				appealLPD: 'Bradford',
				applicationAbout: null,
				applicationDecision: 'Granted with conditions',
				applicationType: 'Listed building consent',
				deadlineDate: { date: 4, day: 'Friday', month: 'November', year: 2022 },
				decisionDate: '04 May 2022',
				dateOfDecisionLabel: 'Date of decision',
				enforcementNotice: 'No',
				isListedBuilding: null,
				changeLpaUrl: '/before-you-start/local-planning-authority',
				nextPageUrl: '/listed-building/email-address',
				isV2forS78: false,
				isV2forCAS: false,
				bannerHtmlOverride:
					config.betaBannerText +
					config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl('S20'))
			});
		});
	});

	describe('getCanUseService - cas planning', () => {
		it('renders page - cas planning', async () => {
			isLpaInFeatureFlag.mockImplementation((_, flag) => {
				return flag === FLAG.CAS_PLANNING_APPEAL_FORM_V2;
			});
			const casPlanningAppeal = {
				typeOfPlanningApplication: MINOR_COMMERCIAL_DEVELOPMENT,
				lpaCode: 'E60000068',
				decisionDate: fullAppeal.decisionDate,
				eligibility: {
					applicationDecision: 'granted',
					planningApplicationAbout: ['none_of_these']
				}
			};
			req = mockReq(casPlanningAppeal);

			await getCanUseService(req, res);

			expect(res.render).toHaveBeenCalledWith(canUseServiceFullAppealUrl, {
				appealLPD: 'Bradford',
				applicationAbout: ['None of these'],
				applicationDecision: 'Granted with conditions',
				applicationType: 'Minor commercial development',
				deadlineDate: { date: 4, day: 'Friday', month: 'November', year: 2022 },
				decisionDate: '04 May 2022',
				dateOfDecisionLabel: 'Date of decision',
				enforcementNotice: 'No',
				isListedBuilding: 'No',
				nextPageUrl: '/cas-planning/email-address',
				changeLpaUrl: '/before-you-start/local-planning-authority',
				isV2forS78: false,
				isV2forCAS: true,
				bannerHtmlOverride:
					config.betaBannerText +
					config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl('CAS_PLANNING'))
			});
		});
	});
});
