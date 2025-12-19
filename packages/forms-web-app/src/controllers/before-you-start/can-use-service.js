const {
	getAppealPropsForCanUseServicePage
} = require('../../lib/get-appeal-props-for-can-use-service-page');
const { getEnforcementNoticeProps } = require('../../lib/get-enforcement-notice-props');
const { businessRulesDeadline } = require('../../lib/calculate-deadline');
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
const { validation } = require('@pins/business-rules');
const config = require('../../config');
const changeLpaUrl = '/before-you-start/local-planning-authority';
const { caseTypeLookup } = require('@pins/common/src/database/data-static');

const canUseServiceHouseholderPlanning = async (req, res) => {
	const { appeal } = req.session;

	const {
		appealLPD,
		applicationType,
		applicationDecision,
		decisionDate,
		enforcementNotice,
		dateOfDecisionLabel,
		nextPageUrl
	} = await getAppealPropsForCanUseServicePage(appeal);

	const deadlineDate = businessRulesDeadline(
		appeal.decisionDate,
		appeal.appealType,
		appeal.eligibility.applicationDecision
	);

	const appealType = caseTypeLookup(appeal.appealType, 'id')?.processCode;

	res.render(canUseServiceHouseholder, {
		deadlineDate,
		appealLPD,
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
		applicationType,
		applicationAbout,
		applicationDecision,
		decisionDate,
		enforcementNotice,
		dateOfDecisionLabel,
		nextPageUrl,
		hideListedBuilding,
		isListedBuilding,
		hideGrantedRefused,
		hideDecisionDate
	} = await getAppealPropsForCanUseServicePage(appeal);

	const deadlineDate = hideDecisionDate
		? null
		: businessRulesDeadline(
				appeal.decisionDate,
				appeal.appealType,
				appeal.eligibility.applicationDecision
			);

	const appealType = caseTypeLookup(appeal.appealType, 'id')?.processCode;

	res.render(canUseServiceFullAppealView, {
		deadlineDate,
		appealLPD,
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
		hideGrantedRefused,
		hideDecisionDate,
		bannerHtmlOverride:
			config.betaBannerText +
			config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl(appealType))
	});
};

const canUseServicePriorApproval = async (req, res) => {
	const { appeal } = req.session;
	const {
		appealLPD,
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
		const deadlineDate = businessRulesDeadline(
			appeal.decisionDate,
			appeal.appealType,
			appeal.eligibility.applicationDecision
		);

		res.render(canUseServicePriorApprovalHouseholder, {
			deadlineDate,
			appealLPD,
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
		const deadlineDate = businessRulesDeadline(
			appeal.decisionDate,
			appeal.appealType,
			appeal.eligibility.applicationDecision
		);

		res.render(canUseServicePriorApprovalFull, {
			deadlineDate,
			appealLPD,
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
		const deadlineDate = businessRulesDeadline(
			appeal.decisionDate,
			appeal.appealType,
			appeal.eligibility.applicationDecision
		);

		res.render(canUseServiceRemovalOrVariationOfConditionsHouseholder, {
			deadlineDate,
			appealLPD,
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
		const deadlineDate = businessRulesDeadline(
			appeal.decisionDate,
			appeal.appealType,
			appeal.eligibility.applicationDecision
		);

		res.render(canUseServiceRemovalOrVariationOfConditionsFullAppeal, {
			deadlineDate,
			appealLPD,
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
			config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl('ENFORCEMENT'))
	});
};

exports.getCanUseService = async (req, res) => {
	const { appeal } = req.session;

	if (appeal.eligibility?.enforcementNotice) {
		return await canUseServiceEnforcement(req, res);
	}

	const applicationType = appeal.typeOfPlanningApplication;

	// check deadline if a decisionDate exists
	if (
		appeal.decisionDate &&
		!validation.appeal.decisionDate.isWithinDecisionDateExpiryPeriod(
			new Date(appeal.decisionDate),
			appeal.appealType,
			appeal.eligibility?.applicationDecision
		)
	) {
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
