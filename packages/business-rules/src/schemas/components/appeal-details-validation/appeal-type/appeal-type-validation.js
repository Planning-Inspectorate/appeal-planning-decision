const pinsYup = require('../../../../lib/pins-yup');
const stringValidation = require('../../string-validators/string-validation');
const stringSelectionValidation = require('../../string-validators/string-selection-validation');
const { APPEAL_ID } = require('../../../../constants');

const appealTypeValidation = () => {
	return pinsYup.lazy((appealType) => {
		if (appealType) {
			return stringSelectionValidation(Object.values(APPEAL_ID));
		}
		return stringValidation();
	});
};

module.exports = appealTypeValidation;
