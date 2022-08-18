const pinsYup = require('../../../../lib/pins-yup');
const { APPEAL_ID } = require('../../../../constants');
const stringValidation = require('../../../components/string-validators/string-validation');
const stringSelectionValidation = require('../../../components/string-validators/string-selection-validation');

const appealTypeValidation = () => {
	return pinsYup.lazy((appealType) => {
		if (appealType) {
			return stringSelectionValidation(Object.values(APPEAL_ID));
		}
		return stringValidation();
	});
};

module.exports = appealTypeValidation;
