const {
	getAppealPropsForCanUseServicePage
} = require('../../lib/get-appeal-props-for-can-use-service-page');
const { getEnforcementNoticeProps } = require('../../lib/get-enforcement-notice-props');
const {
	calculateDeadlineFromBeforeYouStart
} = require('@pins/business-rules/src/utils/calculate-deadline-before-you-start');
const {
	calculateWithinDeadlineFromBeforeYouStart
} = require('@pins/business-rules/src/utils/calculate-is-within-deadline-before-you-start');
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
			CAN_USE_SERVICE_FULL_APPEAL: canUseServiceFullAppealView,
			CAN_USE_SERVICE_PRIOR_APPROVAL: canUseServicePriorApprovalFull,
			CAN_USE_SERVICE_REMOVAL_OR_VARIATION_OF_CONDITIONS:
				canUseServiceRemovalOrVariationOfConditionsFullAppeal
		}
	}
} = require('../../lib/views');
const {
	TYPE_OF_PLANNING_APPLICATION: {
		FULL_APPEAL,
		OUTLINE_PLANNING,
		RESERVED_MATTERS,
		REMOVAL_OR_VARIATION_OF_CONDITIONS,
		PRIOR_APPROVAL,
		LISTED_BUILDING,
		MINOR_COMMERCIAL_DEVELOPMENT,
		ADVERTISEMENT,
		LAWFUL_DEVELOPMENT_CERTIFICATE
	}
} = require('@pins/business-rules/src/constants');
const config = require('../../config');
const changeLpaUrl = '/before-you-start/local-planning-authority';
const { caseTypeLookup } = require('@pins/common/src/database/data-static');
const formatDate = require('#lib/format-date-check-your-answers');

const canUseServiceHouseholderPlanning = async (req, res) => {
	const { appeal } = req.session;

	const {
		appealLPD,
		planningApplicationNumber,
		applicationType,
		applicationDecision,
		decisionDate,
		enforcementNotice,
		dateOfDecisionLabel,
		nextPageUrl
	} = await getAppealPropsForCanUseServicePage(appeal);

	const deadlineDate = calculateDeadlineFromBeforeYouStart({ appeal });

	const appealType = caseTypeLookup(appeal.appealType, 'id')?.processCode;

	res.render(canUseServiceHouseholder, {
		deadlineDate: deadlineDate ? formatDate(deadlineDate) : null,
		appealLPD,
		planningApplicationNumber,
		applicationType,
		applicationDecision,
		decisionDate,
		enforcementNotice,
		dateOfDecisionLabel,
		nextPageUrl,
		changeLpaUrl,
		bannerHtmlOverride:
			config.betaBannerText +
			config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl(appealType))
	});
};

const canUseServiceFullAppeal = async (req, res) => {
	const { appeal } = req.session;
	const {
		appealLPD,
		planningApplicationNumber,
		applicationType,
		applicationAbout,
		applicationDecision,
		decisionDate,
		enforcementNotice,
		dateOfDecisionLabel,
		nextPageUrl,
		hideListedBuilding,
		isListedBuilding,
		hideDeadlineDate
	} = await getAppealPropsForCanUseServicePage(appeal);

	const deadlineDate = hideDeadlineDate ? null : calculateDeadlineFromBeforeYouStart({ appeal });

	const appealType = caseTypeLookup(appeal.appealType, 'id')?.processCode;

	res.render(canUseServiceFullAppealView, {
		deadlineDate: deadlineDate ? formatDate(deadlineDate) : null,
		hideDeadlineDate,
		appealLPD,
		planningApplicationNumber,
		applicationType,
		applicationAbout,
		applicationDecision,
		decisionDate,
		enforcementNotice,
		dateOfDecisionLabel,
		nextPageUrl,
		changeLpaUrl,
		hideListedBuilding,
		isListedBuilding,
		bannerHtmlOverride:
			config.betaBannerText +
			config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl(appealType))
	});
};

const canUseServicePriorApproval = async (req, res) => {
	const { appeal } = req.session;
	const {
		appealLPD,
		planningApplicationNumber,
		applicationType,
		applicationDecision,
		decisionDate,
		enforcementNotice,
		dateOfDecisionLabel,
		nextPageUrl
	} = await getAppealPropsForCanUseServicePage(appeal);

	const hasPriorApprovalForExistingHome = appeal.eligibility.hasPriorApprovalForExistingHome
		? 'Yes'
		: 'No';

	if (appeal.eligibility.hasPriorApprovalForExistingHome) {
		const deadlineDate = calculateDeadlineFromBeforeYouStart({ appeal });

		res.render(canUseServicePriorApprovalHouseholder, {
			deadlineDate: deadlineDate ? formatDate(deadlineDate) : null,
			appealLPD,
			planningApplicationNumber,
			applicationType,
			applicationDecision,
			decisionDate,
			enforcementNotice,
			dateOfDecisionLabel,
			hasPriorApprovalForExistingHome,
			changeLpaUrl,
			nextPageUrl
		});
	} else {
		const deadlineDate = calculateDeadlineFromBeforeYouStart({ appeal });

		res.render(canUseServicePriorApprovalFull, {
			deadlineDate: deadlineDate ? formatDate(deadlineDate) : null,
			appealLPD,
			planningApplicationNumber,
			applicationType,
			applicationDecision,
			decisionDate,
			enforcementNotice,
			dateOfDecisionLabel,
			hasPriorApprovalForExistingHome,
			changeLpaUrl,
			nextPageUrl
		});
	}
};

const canUseServiceRemovalOrVariationOfConditions = async (req, res) => {
	const { appeal } = req.session;
	const {
		appealLPD,
		planningApplicationNumber,
		applicationType,
		applicationDecision,
		decisionDate,
		enforcementNotice,
		dateOfDecisionLabel,
		nextPageUrl
	} = await getAppealPropsForCanUseServicePage(appeal);

	const hasHouseholderPermissionConditions = appeal.eligibility.hasHouseholderPermissionConditions
		? 'Yes'
		: 'No';

	const isListedBuilding = appeal.eligibility.isListedBuilding ? 'Yes' : 'No';

	if (appeal.eligibility.hasHouseholderPermissionConditions) {
		const deadlineDate = calculateDeadlineFromBeforeYouStart({ appeal });

		res.render(canUseServiceRemovalOrVariationOfConditionsHouseholder, {
			deadlineDate: deadlineDate ? formatDate(deadlineDate) : null,
			appealLPD,
			planningApplicationNumber,
			applicationType,
			isListedBuilding,
			applicationDecision,
			decisionDate,
			enforcementNotice,
			dateOfDecisionLabel,
			hasHouseholderPermissionConditions,
			changeLpaUrl,
			nextPageUrl
		});
	} else {
		const deadlineDate = calculateDeadlineFromBeforeYouStart({ appeal });

		res.render(canUseServiceRemovalOrVariationOfConditionsFullAppeal, {
			deadlineDate: deadlineDate ? formatDate(deadlineDate) : null,
			appealLPD,
			planningApplicationNumber,
			applicationType,
			applicationDecision,
			decisionDate,
			enforcementNotice,
			dateOfDecisionLabel,
			hasHouseholderPermissionConditions,
			isListedBuilding,
			changeLpaUrl,
			nextPageUrl
		});
	}
};

const canUseServiceEnforcement = async (req, res) => {
	const { appeal } = req.session;
	const {
		appealLPD,
		enforcementNotice,
		enforcementNoticeListedBuilding,
		enforcementIssueDate,
		enforcementEffectiveDate,
		contactedPlanningInspectorate,
		hasContactedPlanningInspectorate,
		contactedPlanningInspectorateDate,
		nextPageUrl,
		deadlineDate
	} = await getEnforcementNoticeProps(appeal);

	const appealType = appeal.eligibility.enforcementNoticeListedBuilding
		? 'ENFORCEMENT_LISTED_BUILDING'
		: 'ENFORCEMENT';

	res.render(canUseServiceEnforcementView, {
		deadlineDate,
		appealLPD,
		enforcementNotice,
		enforcementNoticeListedBuilding,
		enforcementIssueDate,
		enforcementEffectiveDate,
		contactedPlanningInspectorate,
		hasContactedPlanningInspectorate,
		contactedPlanningInspectorateDate,
		nextPageUrl,
		bannerHtmlOverride:
			config.betaBannerText +
			config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl(appealType))
	});
};

exports.getCanUseService = async (req, res) => {
	const { appeal } = req.session;

	if (appeal.eligibility?.enforcementNotice) {
		return await canUseServiceEnforcement(req, res);
	}

	const applicationType = appeal.typeOfPlanningApplication;

	// check deadline if a decisionDate exists
	if (appeal.decisionDate && !calculateWithinDeadlineFromBeforeYouStart({ appeal })) {
		return res.redirect('/before-you-start/you-cannot-appeal');
	}

	switch (applicationType) {
		case FULL_APPEAL:
		case OUTLINE_PLANNING:
		case RESERVED_MATTERS:
		case LISTED_BUILDING:
		case MINOR_COMMERCIAL_DEVELOPMENT:
		case ADVERTISEMENT:
		case LAWFUL_DEVELOPMENT_CERTIFICATE:
			await canUseServiceFullAppeal(req, res);
			break;
		case PRIOR_APPROVAL:
			await canUseServicePriorApproval(req, res);
			break;
		case REMOVAL_OR_VARIATION_OF_CONDITIONS:
			await canUseServiceRemovalOrVariationOfConditions(req, res);
			break;
		default:
			await canUseServiceHouseholderPlanning(req, res);
	}
};
