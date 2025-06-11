const pinsYup = require('../../../../lib/pins-yup');
const booleanValidation = require('../../../components/boolean-validation');
const applicationDecisionValidation = require('../../../components/eligibility/application-decision-validation');
const applicationCategoriesValidation = require('./application-categories/application-categories-validation');
const applicationAboutValidation = require('./application-about/application-about-validation');

const eligibilityValidation = () => {
	return pinsYup
		.object()
		.shape({
			applicationCategories: applicationCategoriesValidation(),
			applicationDecision: applicationDecisionValidation(),
			enforcementNotice: booleanValidation(),
			hasPriorApprovalForExistingHome: booleanValidation(),
			hasHouseholderPermissionConditions: booleanValidation(),
			isListedBuilding: booleanValidation(),
			planningApplicationAbout: applicationAboutValidation()
		})
		.noUnknown(true);
};

module.exports = eligibilityValidation;
