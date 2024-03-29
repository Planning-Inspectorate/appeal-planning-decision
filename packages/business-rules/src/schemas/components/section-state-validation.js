const pinsYup = require('../../lib/pins-yup');
const { SECTION_STATE } = require('../../constants');

const sectionStateValidation = () => {
	return pinsYup.string().oneOf(Object.values(SECTION_STATE)).default('NOT STARTED');
};

module.exports = sectionStateValidation;
