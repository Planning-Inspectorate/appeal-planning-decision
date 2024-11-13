const { extractAppealProps } = require('../../lib/extract-appeal-props');
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
	} = await extractAppealProps(appeal);

	const isListedBuilding = appeal.eligibility.isListedBuilding ? 'Yes' : 'No';

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
	} = await extractAppealProps(appeal);

	const deadlineDate = businessRulesDeadline(
		appeal.decisionDate,
		appeal.appealType,
		appeal.eligibility.applicationDecision
	);

	res.render(canUseServiceFullAppealUrl, {
		bannerHtmlOverride: config.betaBannerText,
		deadlineDate,
		appealLPD,
		applicationType,
		applicationDecision,
		decisionDate,
		enforcementNotice,
		dateOfDecisionLabel,
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
	} = await extractAppealProps(appeal);

	const hasPriorApprovalForExistingHome = appeal.eligibility.hasPriorApprovalForExistingHome
		? 'Yes'
		: 'No';

	if (appeal.eligibility.hasPriorApprovalForExistingHome) {
		const isListedBuilding = appeal.eligibility.isListedBuilding ? 'Yes' : 'No';

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
	} = await extractAppealProps(appeal);

	const hasHouseholderPermissionConditions = appeal.eligibility.hasHouseholderPermissionConditions
		? 'Yes'
		: 'No';

	if (appeal.eligibility.hasHouseholderPermissionConditions) {
		const isListedBuilding = appeal.eligibility.isListedBuilding ? 'Yes' : 'No';

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
			nextPageUrl
		});
	}
};

exports.getCanUseService = async (req, res) => {
	const { appeal } = req.session;
	const applicationType = appeal.typeOfPlanningApplication;

	switch (applicationType) {
		case 'full-appeal':
		case 'outline-planning':
		case 'reserved-matters':
			await canUseServiceFullAppeal(req, res);
			break;
		case 'prior-approval':
			await canUseServicePriorApproval(req, res);
			break;
		case 'removal-or-variation-of-conditions':
			await canUseServiceRemovalOrVariationOfConditions(req, res);
			break;
		default:
			await canUseServiceHouseholderPlanning(req, res);
	}
};
