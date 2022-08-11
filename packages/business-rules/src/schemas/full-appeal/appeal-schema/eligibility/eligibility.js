const { APPLICATION_CATEGORIES, APPLICATION_DECISION } = require('../../../../constants');
const pinsYup = require('../../../../lib/pins-yup');
const { boolValidation } = require('../../../components/insert/bool-validation');
const { stringValidation } = require('../../../components/insert/string-validation');

const eligibilityValidation = () => {
	return pinsYup
		.object()
		.shape({
			applicationCategories: pinsYup.lazy((applicationCategories) => {
				if (applicationCategories) {
					return pinsYup
						.array()
						.allOfSelectedOptions('applicationCategories', Object.values(APPLICATION_CATEGORIES));
				}
				return pinsYup.object().nullable();
			}),
			applicationDecision: pinsYup.lazy((applicationDecision) => {
				if (applicationDecision) {
					return pinsYup.string().oneOf(Object.values(APPLICATION_DECISION));
				}
				return stringValidation();
			}),
			enforcementNotice: boolValidation(),
			hasPriorApprovalForExistingHome: boolValidation(),
			hasHouseholderPermissionConditions: boolValidation()
		})
		.noUnknown(true);
};

module.exports = { eligibilityValidation };
