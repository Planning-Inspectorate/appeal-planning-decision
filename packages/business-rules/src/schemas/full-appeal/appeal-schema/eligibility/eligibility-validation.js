const pinsYup = require('../../../../lib/pins-yup');
const booleanValidation = require('../../../components/boolean-validation');
const applicationDecisionValidation = require('../../../components/eligibility/application-decision-validation');
const applicationCategoriesValidation = require('./application-categories/application-categories-validation');

const eligibilityValidation = () => {
	return pinsYup
		.object()
		.shape({
			applicationCategories: applicationCategoriesValidation(),
			applicationDecision: applicationDecisionValidation(),
			enforcementNotice: booleanValidation(),
			hasPriorApprovalForExistingHome: booleanValidation(),
			hasHouseholderPermissionConditions: booleanValidation(),
			isListedBuilding: booleanValidation()
		})
		.noUnknown(true);
};

module.exports = eligibilityValidation;
