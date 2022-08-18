const pinsYup = require('../../../../../lib/pins-yup');
const { APPLICATION_DECISION } = require('../../../../../constants');
const stringSelectionValidation = require('../../../../components/string-validators/string-selection-validation');
const stringValidation = require('../../../../components/string-validators/string-validation');

const applicationDecisionValidation = () => {
	return pinsYup.lazy((applicationDecision) => {
		if (applicationDecision) {
			return stringSelectionValidation(Object.values(APPLICATION_DECISION));
		}
		return stringValidation();
	});
};

module.exports = applicationDecisionValidation;
