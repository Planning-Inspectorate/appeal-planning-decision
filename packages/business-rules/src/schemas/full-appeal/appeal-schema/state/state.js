const { APPEAL_STATE } = require('../../../../constants');
const pinsYup = require('../../../../lib/pins-yup');

const stateValidation = () => {
	return pinsYup.string().oneOf(Object.values(APPEAL_STATE)).default(APPEAL_STATE.DRAFT);
};

module.exports = { stateValidation };
