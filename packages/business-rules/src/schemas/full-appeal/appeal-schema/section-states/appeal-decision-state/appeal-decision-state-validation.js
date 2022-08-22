const pinsYup = require('../../../../../lib/pins-yup');
const sectionStateValidation = require('../../../../components/section-state-validation');

const appealDecisionStateValidation = () => {
	return pinsYup
		.object()
		.shape({
			procedureType: sectionStateValidation(),
			hearing: sectionStateValidation(),
			inquiry: sectionStateValidation(),
			inquiryExpectedDays: sectionStateValidation(),
			draftStatementOfCommonGround: sectionStateValidation()
		})
		.noUnknown(true);
};

module.exports = appealDecisionStateValidation;
