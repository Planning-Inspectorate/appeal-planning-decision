const { TYPE_OF_PLANNING_APPLICATION } = require('../../../../constants');
const { stringValidation } = require('../../../components/insert/string-validation');
const pinsYup = require('../../../../lib/pins-yup');

const typeOfPlanningApplicationValidation = () => {
	return pinsYup.lazy((typeOfPlanningApplication) => {
		if (typeOfPlanningApplication) {
			return pinsYup.string().oneOf(Object.values(TYPE_OF_PLANNING_APPLICATION));
		}
		return stringValidation();
	});
};

module.exports = { typeOfPlanningApplicationValidation };
