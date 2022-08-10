const pinsYup = require('../../../../../lib/pins-yup');
const sectionStateValidation = require('../../../generic-validators/section-state-validation');

const requiredDocumentsStateValidation = () => {
	return pinsYup
		.object()
		.shape({
			originalApplication: sectionStateValidation(),
			decisionLetter: sectionStateValidation()
		})
		.noUnknown(true);
};

module.exports = requiredDocumentsStateValidation;
