const {
	getCanUseService
} = require('../../../../src/controllers/before-you-start/can-use-service');
const priorApprovalFPAppeal = require('../../../mockData/prior-approval/prior-approval-fp-route');
const priorApprovalHASAppeal = require('../../../mockData/prior-approval/prior-approval-has-route');
const removalOrVariationOfConditionsFPAppeal = require('../../../mockData/removal-or-variation-of-conditions/removal-or-variation-of-conditions-fp-route');
const removalOrVariationOfConditionsHASAppeal = require('../../../mockData/removal-or-variation-of-conditions/removal-or-variation-of-conditions-has-route');
const { getDepartmentFromId } = require('../../../../src/services/department.service');
const { TYPE_OF_PLANNING_APPLICATION, APPEAL_ID } = require('@pins/business-rules/src/constants');
const {
	VIEW: {
		BEFORE_YOU_START: { ENFORCEMENT_CAN_USE_SERVICE: canUseServiceEnforcementView },
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
	let enforcementNotice;
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
			enforcementNotice = require('../../../mockData/enforcement-notice');
		});
		jest.resetAllMocks();
		res = mockRes();
		getDepartmentFromId.mockImplementation(() => Promise.resolve({ name: 'Bradford' }));
	});

	describe('getCanUseService', () => {
		it('renders page - HAS - date decision due - v2', async () => {
			const householderAppealNoDecisionReceived = { ...householderAppeal };
			householderAppealNoDecisionReceived.eligibility.applicationDecision = 'nodecisionreceived';
			req = mockReq(householderAppealNoDecisionReceived);

			await getCanUseService(req, res);

			expect(res.render).toHaveBeenCalledWith(canUseServiceHouseholder, {
				appealLPD: 'Bradford',
				applicationDecision: 'No decision received',
				applicationType: 'Householder planning',
				deadlineDate: { date: 4, day: 'Friday', month: 'November', year: 2022 },
				decisionDate: '04 May 2022',
				dateOfDecisionLabel: 'Date decision due',
				enforcementNotice: 'No',
				nextPageUrl: '/full-appeal/submit-appeal/email-address',
				changeLpaUrl: '/before-you-start/local-planning-authority',
				bannerHtmlOverride: bannerHtmlOverrideHAS
			});
		});

		it('renders page - HAS - date of decision - v2', async () => {
			req = mockReq(householderAppeal);

			await getCanUseService(req, res);

			expect(res.render).toHaveBeenCalledWith(canUseServiceHouseholder, {
				appealLPD: 'Bradford',
				applicationDecision: 'Granted with conditions',
				applicationType: 'Householder planning',
				deadlineDate: { date: 4, day: 'Friday', month: 'November', year: 2022 },
				decisionDate: '04 May 2022',
				dateOfDecisionLabel: 'Date of decision',
				enforcementNotice: 'No',
				nextPageUrl: '/full-appeal/submit-appeal/email-address',
				changeLpaUrl: '/before-you-start/local-planning-authority',
				bannerHtmlOverride: bannerHtmlOverrideHAS
			});
		});
	});

	describe('getCanUseService - prior approval', () => {
		it('renders page - s78 - no prior approval - v2', async () => {
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
				nextPageUrl: '/full-appeal/submit-appeal/email-address',
				changeLpaUrl: '/before-you-start/local-planning-authority'
			});
		});

		it('renders page - s78 - no prior approval - v2', async () => {
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
				changeLpaUrl: '/before-you-start/local-planning-authority',
				nextPageUrl: '/full-appeal/submit-appeal/email-address'
			});
		});

		it('renders page - HAS - prior approval - v2', async () => {
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
				hasPriorApprovalForExistingHome: 'Yes',
				changeLpaUrl: '/before-you-start/local-planning-authority',
				nextPageUrl: '/appeal-householder-decision/email-address'
			});
		});
	});

	describe('getCanUseService - removal or variation of conditions', () => {
		it('renders page - s78', async () => {
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
					hasHouseholderPermissionConditions: 'Yes',
					isListedBuilding: 'No',
					changeLpaUrl: '/before-you-start/local-planning-authority',
					nextPageUrl: '/appeal-householder-decision/email-address'
				}
			);
		});
	});

	describe('getCanUseService - s78', () => {
		beforeEach(() => {
			isLpaInFeatureFlag.mockImplementation(() => false);
		});

		it('renders page - s78 - date of decision - v2', async () => {
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
				changeLpaUrl: '/before-you-start/local-planning-authority',
				nextPageUrl: '/full-appeal/submit-appeal/email-address',
				hideListedBuilding: true,
				isListedBuilding: null,
				hideGrantedRefused: false,
				hideDecisionDate: false,
				bannerHtmlOverride
			});
		});

		it('renders page - s78 - date of decision - v2', async () => {
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
				changeLpaUrl: '/before-you-start/local-planning-authority',
				nextPageUrl: '/full-appeal/submit-appeal/email-address',
				hideListedBuilding: true,
				isListedBuilding: null,
				hideGrantedRefused: false,
				hideDecisionDate: false,
				bannerHtmlOverride
			});
		});

		it('renders page - s78 - date decision due - v2', async () => {
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
				nextPageUrl: '/full-appeal/submit-appeal/email-address',
				changeLpaUrl: '/before-you-start/local-planning-authority',
				hideListedBuilding: true,
				isListedBuilding: null,
				hideGrantedRefused: false,
				hideDecisionDate: false,
				bannerHtmlOverride
			});
		});

		it('renders page - s78 - decision is granted and type of application is minor commercial development', async () => {
			const fullPlanningAppealMinorCommercialGranted = {
				typeOfPlanningApplication: TYPE_OF_PLANNING_APPLICATION.MINOR_COMMERCIAL_DEVELOPMENT,
				appealType: APPEAL_ID.PLANNING_SECTION_78,
				lpaCode: 'E60000068',
				decisionDate: fullAppeal.decisionDate,
				eligibility: {
					applicationDecision: 'granted',
					planningApplicationAbout: ['none_of_these']
				}
			};
			req = mockReq(fullPlanningAppealMinorCommercialGranted);

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
				nextPageUrl: '/full-appeal/submit-appeal/email-address',
				changeLpaUrl: '/before-you-start/local-planning-authority',
				hideListedBuilding: true,
				isListedBuilding: null,
				hideGrantedRefused: false,
				hideDecisionDate: false,
				bannerHtmlOverride:
					config.betaBannerText +
					config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl('S78'))
			});
		});

		it('renders page - s78 - decision is no decision and type of application is minor commercial development', async () => {
			const fullPlanningAppealMinorCommercialNoDecision = {
				typeOfPlanningApplication: TYPE_OF_PLANNING_APPLICATION.MINOR_COMMERCIAL_DEVELOPMENT,
				appealType: APPEAL_ID.PLANNING_SECTION_78,
				lpaCode: 'E60000068',
				decisionDate: fullAppeal.decisionDate,
				eligibility: {
					applicationDecision: 'nodecisionreceived',
					planningApplicationAbout: ['none_of_these']
				}
			};
			req = mockReq(fullPlanningAppealMinorCommercialNoDecision);

			await getCanUseService(req, res);

			expect(res.render).toHaveBeenCalledWith(canUseServiceFullAppealUrl, {
				appealLPD: 'Bradford',
				applicationAbout: ['None of these'],
				applicationDecision: 'No decision received',
				applicationType: 'Minor commercial development',
				deadlineDate: { date: 4, day: 'Friday', month: 'November', year: 2022 },
				decisionDate: '04 May 2022',
				dateOfDecisionLabel: 'Date decision due',
				enforcementNotice: 'No',
				nextPageUrl: '/full-appeal/submit-appeal/email-address',
				changeLpaUrl: '/before-you-start/local-planning-authority',
				hideListedBuilding: true,
				isListedBuilding: null,
				hideGrantedRefused: false,
				hideDecisionDate: false,
				bannerHtmlOverride:
					config.betaBannerText +
					config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl('S78'))
			});
		});

		it('renders page - s78 - date decision due - v2', async () => {
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
				hideListedBuilding: true,
				isListedBuilding: null,
				hideGrantedRefused: false,
				hideDecisionDate: false,
				changeLpaUrl: '/before-you-start/local-planning-authority',
				nextPageUrl: '/full-appeal/submit-appeal/email-address',
				bannerHtmlOverride
			});
		});
	});

	describe('getCanUseService - s20', () => {
		beforeEach(() => {
			isLpaInFeatureFlag.mockImplementation(() => false);
		});

		it('renders page - s20', async () => {
			const s20Appeal = {
				appealType: APPEAL_ID.PLANNING_LISTED_BUILDING,
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
				changeLpaUrl: '/before-you-start/local-planning-authority',
				nextPageUrl: '/listed-building/email-address',
				hideListedBuilding: true,
				isListedBuilding: null,
				hideGrantedRefused: false,
				hideDecisionDate: false,
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
				typeOfPlanningApplication: TYPE_OF_PLANNING_APPLICATION.MINOR_COMMERCIAL_DEVELOPMENT,
				appealType: APPEAL_ID.MINOR_COMMERCIAL,
				lpaCode: 'E60000068',
				decisionDate: fullAppeal.decisionDate,
				eligibility: {
					applicationDecision: 'refused',
					planningApplicationAbout: ['none_of_these']
				}
			};
			req = mockReq(casPlanningAppeal);

			await getCanUseService(req, res);

			expect(res.render).toHaveBeenCalledWith(canUseServiceFullAppealUrl, {
				appealLPD: 'Bradford',
				applicationAbout: ['None of these'],
				applicationDecision: 'Refused',
				applicationType: 'Minor commercial development',
				deadlineDate: { date: 27, day: 'Wednesday', month: 'July', year: 2022 },
				decisionDate: '04 May 2022',
				dateOfDecisionLabel: 'Date of decision',
				enforcementNotice: 'No',
				nextPageUrl: '/cas-planning/email-address',
				changeLpaUrl: '/before-you-start/local-planning-authority',
				hideListedBuilding: true,
				isListedBuilding: null,
				hideGrantedRefused: false,
				hideDecisionDate: false,
				bannerHtmlOverride:
					config.betaBannerText +
					config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl('CAS_PLANNING'))
			});
		});
	});

	describe('getCanUseService - adverts', () => {
		it('renders page - adverts', async () => {
			isLpaInFeatureFlag.mockImplementation((_, flag) => {
				return flag === FLAG.ADVERTS_APPEAL_FORM_V2;
			});
			const advertsAppeal = {
				typeOfPlanningApplication: TYPE_OF_PLANNING_APPLICATION.ADVERTISEMENT,
				appealType: APPEAL_ID.ADVERTISEMENT,
				lpaCode: 'E60000068',
				decisionDate: fullAppeal.decisionDate,
				eligibility: {
					applicationDecision: 'granted',
					planningApplicationAbout: ['none_of_these']
				}
			};
			req = mockReq(advertsAppeal);

			await getCanUseService(req, res);

			expect(res.render).toHaveBeenCalledWith(canUseServiceFullAppealUrl, {
				appealLPD: 'Bradford',
				applicationAbout: null,
				applicationDecision: 'Granted with conditions',
				applicationType: 'Advertisement',
				deadlineDate: { date: 29, day: 'Wednesday', month: 'June', year: 2022 },
				decisionDate: '04 May 2022',
				dateOfDecisionLabel: 'Date of decision',
				enforcementNotice: 'No',
				nextPageUrl: '/adverts/email-address',
				changeLpaUrl: '/before-you-start/local-planning-authority',
				hideListedBuilding: true,
				isListedBuilding: null,
				hideGrantedRefused: false,
				hideDecisionDate: false,
				bannerHtmlOverride:
					config.betaBannerText +
					config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl('ADVERTS'))
			});
		});
	});

	describe('getCanUseService - cas adverts', () => {
		it('renders page - cas adverts', async () => {
			isLpaInFeatureFlag.mockImplementation((_, flag) => {
				return flag === FLAG.CAS_ADVERTS_APPEAL_FORM_V2;
			});
			const advertsAppeal = {
				typeOfPlanningApplication: TYPE_OF_PLANNING_APPLICATION.ADVERTISEMENT,
				appealType: APPEAL_ID.MINOR_COMMERCIAL_ADVERTISEMENT,
				lpaCode: 'E60000068',
				decisionDate: fullAppeal.decisionDate,
				eligibility: {
					applicationDecision: 'refused'
				}
			};
			req = mockReq(advertsAppeal);

			await getCanUseService(req, res);

			expect(res.render).toHaveBeenCalledWith(canUseServiceFullAppealUrl, {
				appealLPD: 'Bradford',
				applicationAbout: null,
				applicationDecision: 'Refused',
				applicationType: 'Advertisement',
				deadlineDate: { date: 29, day: 'Wednesday', month: 'June', year: 2022 },
				decisionDate: '04 May 2022',
				dateOfDecisionLabel: 'Date of decision',
				enforcementNotice: 'No',
				nextPageUrl: '/adverts/email-address',
				changeLpaUrl: '/before-you-start/local-planning-authority',
				hideListedBuilding: true,
				isListedBuilding: null,
				hideGrantedRefused: false,
				hideDecisionDate: false,
				bannerHtmlOverride:
					config.betaBannerText +
					config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl('CAS_ADVERTS'))
			});
		});
	});

	describe('getCanUseService - enforcement notice', () => {
		it('renders page - enforcement - effective date not passed', async () => {
			req = mockReq(enforcementNotice);

			await getCanUseService(req, res);

			expect(res.render).toHaveBeenCalledWith(canUseServiceEnforcementView, {
				deadlineDate: { date: 3, day: 'Tuesday', month: 'May', year: 2022 },
				appealLPD: 'Bradford',
				enforcementNotice: 'Yes',
				enforcementNoticeListedBuilding: 'No',
				enforcementIssueDate: '4 May 2022',
				enforcementEffectiveDate: '4 May 2022',
				contactedPlanningInspectorate: false,
				hasContactedPlanningInspectorate: null,
				contactedPlanningInspectorateDate: null,
				nextPageUrl: '/enforcement/enforcement-reference-number',
				bannerHtmlOverride:
					config.betaBannerText +
					config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl('ENFORCEMENT'))
			});
		});

		it('renders page - enforcement - effective date passed and contacted PINS', async () => {
			enforcementNotice.eligibility.hasContactedPlanningInspectorate = true;
			enforcementNotice.eligibility.contactPlanningInspectorateDate = '2022-05-04T10:55:46.164Z';
			req = mockReq(enforcementNotice);

			await getCanUseService(req, res);

			expect(res.render).toHaveBeenCalledWith(canUseServiceEnforcementView, {
				deadlineDate: { date: 10, day: 'Tuesday', month: 'May', year: 2022 },
				appealLPD: 'Bradford',
				enforcementNotice: 'Yes',
				enforcementNoticeListedBuilding: 'No',
				enforcementIssueDate: '4 May 2022',
				enforcementEffectiveDate: '4 May 2022',
				contactedPlanningInspectorate: true,
				hasContactedPlanningInspectorate: 'Yes',
				contactedPlanningInspectorateDate: '4 May 2022',
				nextPageUrl: '/enforcement/enforcement-reference-number',
				bannerHtmlOverride:
					config.betaBannerText +
					config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl('ENFORCEMENT'))
			});
		});
	});

	describe('getCanUseService - ldc', () => {
		it('renders page - ldc S191 or S192 have no deadline and no granted or refused question', async () => {
			isLpaInFeatureFlag.mockImplementation((_, flag) => {
				return flag === FLAG.LDC_APPEAL_FORM_V2;
			});
			const ldcAppeal = {
				typeOfPlanningApplication: TYPE_OF_PLANNING_APPLICATION.LAWFUL_DEVELOPMENT_CERTIFICATE,
				appealType: APPEAL_ID.LAWFUL_DEVELOPMENT_CERTIFICATE,
				lpaCode: 'E60000068',
				decisionDate: fullAppeal.decisionDate,
				eligibility: {
					isListedBuilding: false
				}
			};
			req = mockReq(ldcAppeal);

			await getCanUseService(req, res);

			expect(res.render).toHaveBeenCalledWith(canUseServiceFullAppealUrl, {
				appealLPD: 'Bradford',
				applicationAbout: null,
				applicationDecision: '',
				applicationType: 'Lawful development certificate',
				deadlineDate: null,
				decisionDate: null,
				dateOfDecisionLabel: 'Date of decision',
				enforcementNotice: 'No',
				nextPageUrl: '/ldc/email-address',
				changeLpaUrl: '/before-you-start/local-planning-authority',
				hideListedBuilding: false,
				isListedBuilding: 'No',
				hideGrantedRefused: true,
				hideDecisionDate: true,
				bannerHtmlOverride:
					config.betaBannerText +
					config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl('LDC'))
			});
		});

		it('renders page - ldc S26H has 6 month deadline and asks granted or refused', async () => {
			isLpaInFeatureFlag.mockImplementation((_, flag) => {
				return flag === FLAG.LDC_APPEAL_FORM_V2;
			});
			const ldcAppeal = {
				typeOfPlanningApplication: TYPE_OF_PLANNING_APPLICATION.LAWFUL_DEVELOPMENT_CERTIFICATE,
				appealType: APPEAL_ID.LAWFUL_DEVELOPMENT_CERTIFICATE,
				lpaCode: 'E60000068',
				decisionDate: fullAppeal.decisionDate,
				eligibility: {
					isListedBuilding: true,
					applicationDecision: 'refused'
				}
			};
			req = mockReq(ldcAppeal);

			await getCanUseService(req, res);

			expect(res.render).toHaveBeenCalledWith(canUseServiceFullAppealUrl, {
				appealLPD: 'Bradford',
				applicationAbout: null,
				applicationDecision: 'Refused',
				applicationType: 'Lawful development certificate',
				deadlineDate: { date: 4, day: 'Friday', month: 'November', year: 2022 },
				decisionDate: '04 May 2022',
				dateOfDecisionLabel: 'Date of decision',
				enforcementNotice: 'No',
				nextPageUrl: '/ldc/email-address',
				changeLpaUrl: '/before-you-start/local-planning-authority',
				hideListedBuilding: false,
				isListedBuilding: 'Yes',
				hideGrantedRefused: false,
				hideDecisionDate: false,
				bannerHtmlOverride:
					config.betaBannerText +
					config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl('LDC'))
			});
		});
	});
});
