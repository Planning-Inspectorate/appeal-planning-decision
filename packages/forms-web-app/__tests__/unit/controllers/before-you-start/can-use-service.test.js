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

jest.mock('../../../../src/services/department.service');

const { mockReq, mockRes } = require('../../mocks');

describe('controllers/before-you-start/can-use-service', () => {
	let req;
	let res;

	beforeEach(() => {
		jest.resetAllMocks();
		res = mockRes();
		getDepartmentFromId.mockImplementation(() => Promise.resolve({ name: 'Bradford' }));
	});

	describe('Testing controller for HAS Appeals Check Your Answers page', () => {
		it('Test getCanUseService method calls the HAS Check Your Answers page - HAS conditions', async () => {
			req = mockReq(removalOrVariationOfConditionsHASAppeal);

			await getCanUseService(req, res);

			expect(res.render).toBeCalledWith(canUseServiceRemovalOrVariationOfConditionsHouseholder, {
				bannerHtmlOverride: config.betaBannerText,
				appealLPD: 'Bradford',
				applicationDecision: 'Refused',
				applicationType: 'Removal Or Variation Of Conditions',
				deadlineDate: { date: 15, day: 'Sunday', month: 'May', year: 2022 },
				decisionDate: '20 February 2022',
				enforcementNotice: 'No',
				dateOfDecisionLabel: 'Date of Decision',
				claimingCosts: 'No',
				hasHouseholderPermissionConditions: 'Yes',
				isListedBuilding: 'No',
				nextPageUrl: '/appeal-householder-decision/planning-application-number'
			});
		});

		it('Test getCanUseService method calls the HP Check Your Answers page when typeOfPlanningApplication is householder-planning - date of decision', async () => {
			req = mockReq(householderAppeal);

			await getCanUseService(req, res);

			expect(res.render).toBeCalledWith(canUseServiceHouseholder, {
				bannerHtmlOverride: config.betaBannerText,
				appealLPD: 'Bradford',
				applicationDecision: 'Granted with conditions',
				applicationType: 'Householder Planning',
				claimingCosts: 'No',
				deadlineDate: { date: 4, day: 'Friday', month: 'November', year: 2022 },
				decisionDate: '04 May 2022',
				dateOfDecisionLabel: 'Date of Decision',
				enforcementNotice: 'No',
				isListedBuilding: 'No',
				nextPageUrl: '/full-appeal/submit-appeal/planning-application-number'
			});
		});

		it('Test getCanUseService method calls the HP Check Your Answers page when typeOfPlanningApplication is householder-planning - date decision due', async () => {
			const householderAppealNoDecisionReceived = { ...householderAppeal };
			householderAppealNoDecisionReceived.eligibility.applicationDecision = 'nodecisionreceived';
			req = mockReq(householderAppealNoDecisionReceived);

			await getCanUseService(req, res);

			expect(res.render).toBeCalledWith(canUseServiceHouseholder, {
				bannerHtmlOverride: config.betaBannerText,
				appealLPD: 'Bradford',
				applicationDecision: 'No Decision Received',
				applicationType: 'Householder Planning',
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

	describe('Testing Controller for Prior Approval', () => {
		it('Test getCanUseService method calls the Full Appeal Check Your Answers page - no prior approval', async () => {
			req = mockReq(priorApprovalFPAppeal);

			await getCanUseService(req, res);

			expect(res.render).toBeCalledWith(canUseServicePriorApprovalFull, {
				bannerHtmlOverride: config.betaBannerText,
				appealLPD: 'Bradford',
				applicationDecision: 'Refused',
				applicationType: 'Prior Approval',
				deadlineDate: { date: 20, day: 'Saturday', month: 'August', year: 2022 },
				decisionDate: '20 February 2022',
				enforcementNotice: 'No',
				dateOfDecisionLabel: 'Date of Decision',
				hasPriorApprovalForExistingHome: 'No',
				nextPageUrl: '/full-appeal/submit-appeal/planning-application-number'
			});
		});

		it('Test getCanUseService method calls the HAS Check Your Answers page - prior approval', async () => {
			req = mockReq(priorApprovalHASAppeal);

			await getCanUseService(req, res);

			expect(res.render).toBeCalledWith(canUseServicePriorApprovalHouseholder, {
				bannerHtmlOverride: config.betaBannerText,
				appealLPD: 'Bradford',
				applicationDecision: 'Refused',
				applicationType: 'Prior Approval',
				deadlineDate: { date: 15, day: 'Sunday', month: 'May', year: 2022 },
				decisionDate: '20 February 2022',
				enforcementNotice: 'No',
				dateOfDecisionLabel: 'Date of Decision',
				claimingCosts: 'No',
				hasPriorApprovalForExistingHome: 'Yes',
				isListedBuilding: 'No',
				nextPageUrl: '/appeal-householder-decision/planning-application-number'
			});
		});
	});

	describe('Testing Controller for Removal Or Variation Of Conditions', () => {
		it('Test getCanUseService method calls the Full Appeal Check Your Answers page - no HAS conditions', async () => {
			req = mockReq(removalOrVariationOfConditionsFPAppeal);

			await getCanUseService(req, res);

			expect(res.render).toBeCalledWith(canUseServiceRemovalOrVariationOfConditionsFullAppeal, {
				bannerHtmlOverride: config.betaBannerText,
				appealLPD: 'Bradford',
				applicationDecision: 'Refused',
				applicationType: 'Removal Or Variation Of Conditions',
				deadlineDate: { date: 20, day: 'Saturday', month: 'August', year: 2022 },
				decisionDate: '20 February 2022',
				enforcementNotice: 'No',
				dateOfDecisionLabel: 'Date of Decision',
				hasHouseholderPermissionConditions: 'No',
				nextPageUrl: '/full-appeal/submit-appeal/planning-application-number'
			});
		});
	});

	describe('Testing controller for Full Planning Appeals Check Your Answers page', () => {
		it('Test getCanUseService method calls the Full Appeal Check Your Answers page when typeOfPlanningApplication is full-appeal', async () => {
			req = mockReq(fullAppeal);

			await getCanUseService(req, res);

			expect(res.render).toBeCalledWith(canUseServiceFullAppealUrl, {
				bannerHtmlOverride: config.betaBannerText,
				appealLPD: 'Bradford',
				applicationDecision: 'Granted with conditions',
				applicationType: 'Full Appeal',
				deadlineDate: { date: 4, day: 'Friday', month: 'November', year: 2022 },
				decisionDate: '04 May 2022',
				enforcementNotice: 'No',
				dateOfDecisionLabel: 'Date of Decision',
				nextPageUrl: '/full-appeal/submit-appeal/planning-application-number'
			});
		});
		it('Test getCanUseService method calls the Full Appeal Check Your Answers page when typeOfPlanningApplication is full-appeal - date of decision', async () => {
			req = mockReq(fullAppeal);

			await getCanUseService(req, res);

			expect(res.render).toBeCalledWith(canUseServiceFullAppealUrl, {
				bannerHtmlOverride: config.betaBannerText,
				appealLPD: 'Bradford',
				applicationDecision: 'Granted with conditions',
				applicationType: 'Full Appeal',
				deadlineDate: { date: 4, day: 'Friday', month: 'November', year: 2022 },
				decisionDate: '04 May 2022',
				dateOfDecisionLabel: 'Date of Decision',
				enforcementNotice: 'No',
				nextPageUrl: '/full-appeal/submit-appeal/planning-application-number'
			});
		});

		it('Test getCanUseService method calls the Full Appeal Check Your Answers page when typeOfPlanningApplication is full-appeal - date decision due', async () => {
			const fullAppealNoDecisionReceived = { ...fullAppeal };
			fullAppealNoDecisionReceived.eligibility.applicationDecision = 'nodecisionreceived';
			req = mockReq(fullAppealNoDecisionReceived);

			await getCanUseService(req, res);

			expect(res.render).toBeCalledWith(canUseServiceFullAppealUrl, {
				bannerHtmlOverride: config.betaBannerText,
				appealLPD: 'Bradford',
				applicationDecision: 'No Decision Received',
				applicationType: 'Full Appeal',
				deadlineDate: { date: 4, day: 'Friday', month: 'November', year: 2022 },
				decisionDate: '04 May 2022',
				dateOfDecisionLabel: 'Date decision due',
				enforcementNotice: 'No',
				nextPageUrl: '/full-appeal/submit-appeal/planning-application-number'
			});
		});
	});
});
