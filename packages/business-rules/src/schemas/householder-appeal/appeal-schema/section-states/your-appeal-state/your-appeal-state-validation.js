const pinsYup = require('../../../../../lib/pins-yup');
const sectionStateValidation = require('../../../../components/section-state-validation');

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
