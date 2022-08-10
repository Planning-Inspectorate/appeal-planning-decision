const pinsYup = require('../../../../lib/pins-yup');
const { APPEAL_ID } = require('../../../../constants');

const appealTypeValidation = () => {
	return pinsYup.lazy((appealType) => {
		if (appealType) {
			return pinsYup.string().oneOf(Object.values(APPEAL_ID));
		}
		return pinsYup.string().nullable();
	});
};

module.exports = appealTypeValidation;
