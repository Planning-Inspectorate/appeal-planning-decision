const { APPEAL_ID } = require('../../../../constants');
const pinsYup = require('../../../../lib/pins-yup');
const { stringValidation } = require('../../../components/insert/string-validation');

const appealTypeValidation = () => {
	return pinsYup.lazy((appealType) => {
		if (appealType) {
			return pinsYup.string().oneOf(Object.values(APPEAL_ID));
		}
		return stringValidation();
	});
};

module.exports = { appealTypeValidation };
