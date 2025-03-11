const {
	getAppealPropsForCanUseServicePage
} = require('../../lib/get-appeal-props-for-can-use-service-page');
const { businessRulesDeadline } = require('../../lib/calculate-deadline');
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
} = require('../../lib/views');
const config = require('../../config');
const { isLpaInFeatureFlag } = require('#lib/is-lpa-in-feature-flag');
const { FLAG } = require('@pins/common/src/feature-flags');
const {
	TYPE_OF_PLANNING_APPLICATION: {
		FULL_APPEAL,
		OUTLINE_PLANNING,
		RESERVED_MATTERS,
		REMOVAL_OR_VARIATION_OF_CONDITIONS,
		PRIOR_APPROVAL,
		LISTED_BUILDING
	}
} = require('@pins/business-rules/src/constants');

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

	const isV2forS20 = await isLpaInFeatureFlag(appeal.lpaCode, FLAG.S20_APPEAL_FORM_V2);
	const isListedBuilding = isV2forS20 ? null : appeal.eligibility.isListedBuilding ? 'Yes' : 'No';

	const deadlineDate = businessRulesDeadline(
		appeal.decisionDate,
		appeal.appealType,
		appeal.eligibility.applicationDecision
	);

	const claimingCosts =
		typeof appeal.eligibility.isClaimingCosts === 'boolean'
			? appeal.eligibility.isClaimingCosts
				? 'Yes'
				: 'No'
			: null;

	res.render(canUseServiceHouseholder, {
		bannerHtmlOverride: config.betaBannerText,
		deadlineDate,
		appealLPD,
		applicationType,
		isListedBuilding,
		applicationDecision,
		decisionDate,
		enforcementNotice,
		claimingCosts,
		dateOfDecisionLabel,
		nextPageUrl
	});
};

const canUseServiceFullAppeal = async (req, res) => {
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

	const isV2forS20 = await isLpaInFeatureFlag(appeal.lpaCode, FLAG.S20_APPEAL_FORM_V2);
	const isListedBuilding = isV2forS20 ? null : appeal.eligibility.isListedBuilding ? 'Yes' : 'No';
	const isV2forS78 = await isLpaInFeatureFlag(appeal.lpaCode, FLAG.S78_APPEAL_FORM_V2);

	res.render(canUseServiceFullAppealUrl, {
		bannerHtmlOverride: config.betaBannerText,
		deadlineDate,
		appealLPD,
		applicationType,
		applicationDecision,
		decisionDate,
		enforcementNotice,
		dateOfDecisionLabel,
		isListedBuilding,
		isV2forS78,
		nextPageUrl
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

	const isV2forS20 = await isLpaInFeatureFlag(appeal.lpaCode, FLAG.S20_APPEAL_FORM_V2);
	const isListedBuilding = isV2forS20 ? null : appeal.eligibility.isListedBuilding ? 'Yes' : 'No';

	if (appeal.eligibility.hasPriorApprovalForExistingHome) {
		const deadlineDate = businessRulesDeadline(
			appeal.decisionDate,
			appeal.appealType,
			appeal.eligibility.applicationDecision
		);

		const claimingCosts =
			typeof appeal.eligibility.isClaimingCosts === 'boolean'
				? appeal.eligibility.isClaimingCosts
					? 'Yes'
					: 'No'
				: null;

		res.render(canUseServicePriorApprovalHouseholder, {
			bannerHtmlOverride: config.betaBannerText,
			deadlineDate,
			appealLPD,
			applicationType,
			isListedBuilding,
			applicationDecision,
			decisionDate,
			enforcementNotice,
			claimingCosts,
			dateOfDecisionLabel,
			hasPriorApprovalForExistingHome,
			nextPageUrl
		});
	} else {
		const deadlineDate = businessRulesDeadline(
			appeal.decisionDate,
			appeal.appealType,
			appeal.eligibility.applicationDecision
		);

		const isV2forS78 = await isLpaInFeatureFlag(appeal.lpaCode, FLAG.S78_APPEAL_FORM_V2);

		res.render(canUseServicePriorApprovalFull, {
			bannerHtmlOverride: config.betaBannerText,
			deadlineDate,
			appealLPD,
			applicationType,
			applicationDecision,
			decisionDate,
			enforcementNotice,
			dateOfDecisionLabel,
			hasPriorApprovalForExistingHome,
			isListedBuilding,
			isV2forS78,
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

		const claimingCosts =
			typeof appeal.eligibility.isClaimingCosts === 'boolean'
				? appeal.eligibility.isClaimingCosts
					? 'Yes'
					: 'No'
				: null;

		res.render(canUseServiceRemovalOrVariationOfConditionsHouseholder, {
			bannerHtmlOverride: config.betaBannerText,
			deadlineDate,
			appealLPD,
			applicationType,
			isListedBuilding,
			applicationDecision,
			decisionDate,
			enforcementNotice,
			claimingCosts,
			dateOfDecisionLabel,
			hasHouseholderPermissionConditions,
			nextPageUrl
		});
	} else {
		const deadlineDate = businessRulesDeadline(
			appeal.decisionDate,
			appeal.appealType,
			appeal.eligibility.applicationDecision
		);

		const isV2 = await isLpaInFeatureFlag(appeal.lpaCode, FLAG.S78_APPEAL_FORM_V2);

		res.render(canUseServiceRemovalOrVariationOfConditionsFullAppeal, {
			bannerHtmlOverride: config.betaBannerText,
			deadlineDate,
			appealLPD,
			applicationType,
			applicationDecision,
			decisionDate,
			enforcementNotice,
			dateOfDecisionLabel,
			hasHouseholderPermissionConditions,
			isListedBuilding,
			isV2,
			nextPageUrl
		});
	}
};

exports.getCanUseService = async (req, res) => {
	const { appeal } = req.session;
	const applicationType = appeal.typeOfPlanningApplication;

	switch (applicationType) {
		case FULL_APPEAL:
		case OUTLINE_PLANNING:
		case RESERVED_MATTERS:
		case LISTED_BUILDING:
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
