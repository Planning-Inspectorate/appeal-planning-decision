const pinsYup = require('../../../../../lib/pins-yup');
const { APPLICATION_DECISION } = require('../../../../../constants');

const applicationDecisionValidation = () => {
	return pinsYup.lazy((applicationDecision) => {
		if (applicationDecision) {
			return pinsYup.string().oneOf(Object.values(APPLICATION_DECISION));
		}
		return pinsYup.string().nullable();
	});
};

module.exports = applicationDecisionValidation;
