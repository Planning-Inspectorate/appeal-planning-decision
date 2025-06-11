const { APPLICATION_ABOUT } = require('../../../../../constants');
const pinsYup = require('../../../../../lib/pins-yup');

const applicationAboutValidation = () => {
	return pinsYup.lazy((applicationAbout) => {
		if (applicationAbout) {
			return pinsYup
				.array()
				.maybeOption('planningApplicationAbout', Object.values(APPLICATION_ABOUT));
		}
		return pinsYup.object().nullable();
	});
};

module.exports = applicationAboutValidation;
