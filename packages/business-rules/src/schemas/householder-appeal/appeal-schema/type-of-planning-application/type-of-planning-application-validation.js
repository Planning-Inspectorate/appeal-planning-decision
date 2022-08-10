const pinsYup = require('../../../../lib/pins-yup');
const { TYPE_OF_PLANNING_APPLICATION } = require('../../../../constants');

const typeOfPlanningApplicationValidation = () => {
	return pinsYup.lazy((typeOfPlanningApplication) => {
		if (typeOfPlanningApplication) {
			return pinsYup.string().oneOf(Object.values(TYPE_OF_PLANNING_APPLICATION));
		}
		return pinsYup.string().nullable();
	});
};

module.exports = typeOfPlanningApplicationValidation;
