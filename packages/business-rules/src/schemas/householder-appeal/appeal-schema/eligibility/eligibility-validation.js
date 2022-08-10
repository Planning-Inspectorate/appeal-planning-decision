const pinsYup = require('../../../../lib/pins-yup');
const applicationDecisionValidation = require('./application-decision/application-decision-validation');
const enforcementNoticeValidation = require('./enforcement-notice/enforcement-notice-validation');
const householderPermissionConditionsValidation = require('./has-householder-permission-conditions/householder-permission-conditions-validation');
const priorApprovalValidation = require('./has-prior-approval-for-existing-home/prior-approval-validation');
const householderPlanningPermissionValidation = require('./householder-planning-persmission/householder-planning-permission-validation');
const isClaimingCostsValidation = require('./is-claiming-costs/is-claiming-costs-validation');
const isListedBuildingValidation = require('./is-listed-building/is-listed-building-validation');

const eligibilityValidation = () => {
	return pinsYup
		.object()
		.shape({
			applicationDecision: applicationDecisionValidation(),
			enforcementNotice: enforcementNoticeValidation(),
			householderPlanningPermission: householderPlanningPermissionValidation(),
			isClaimingCosts: isClaimingCostsValidation(),
			isListedBuilding: isListedBuildingValidation(),
			hasPriorApprovalForExistingHome: priorApprovalValidation(),
			hasHouseholderPermissionConditions: householderPermissionConditionsValidation()
		})
		.noUnknown(true);
};

module.exports = eligibilityValidation;
