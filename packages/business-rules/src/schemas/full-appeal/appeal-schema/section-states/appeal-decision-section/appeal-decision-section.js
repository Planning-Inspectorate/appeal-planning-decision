const pinsYup = require('../../../../../lib/pins-yup');
const {
	sectionStateValidation
} = require('../../../../components/insert/section-state-validation');

const appealDecisionSectionStateValidation = () => {
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

module.exports = { appealDecisionSectionStateValidation };
