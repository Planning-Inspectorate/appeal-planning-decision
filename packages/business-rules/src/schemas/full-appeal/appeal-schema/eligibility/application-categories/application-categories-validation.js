const { APPLICATION_CATEGORIES } = require('../../../../../constants');
const pinsYup = require('../../../../../lib/pins-yup');

const applicationCategoriesValidation = () => {
	return pinsYup.lazy((applicationCategories) => {
		if (applicationCategories) {
			return pinsYup
				.array()
				.allOfSelectedOptions('applicationCategories', Object.values(APPLICATION_CATEGORIES));
		}
		return pinsYup.object().nullable();
	});
};

module.exports = applicationCategoriesValidation;
