const pinsYup = require('../../../../../lib/pins-yup');
const sectionStateValidation = require('../../../generic-validators/section-state-validation');

const yourAppealStateValidation = () => {
	return pinsYup
		.object()
		.shape({
			appealStatement: sectionStateValidation(),
			otherDocuments: sectionStateValidation()
		})
		.noUnknown(true);
};

module.exports = yourAppealStateValidation;
