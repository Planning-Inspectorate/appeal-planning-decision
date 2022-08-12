const pinsYup = require('../../../../../lib/pins-yup');
const sectionStateValidation = require('../../../../components/section-state-validation');

const appealSiteStateValidation = () => {
	return pinsYup
		.object()
		.shape({
			siteAddress: sectionStateValidation(),
			siteAccess: sectionStateValidation(),
			siteOwnership: sectionStateValidation(),
			healthAndSafety: sectionStateValidation()
		})
		.noUnknown(true);
};

module.exports = appealSiteStateValidation;
