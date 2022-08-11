const pinsYup = require('../../../../../lib/pins-yup');
const {
	sectionStateValidation
} = require('../../../../components/insert/section-state-validation');

const appealSiteSectionStateValidation = () => {
	return pinsYup
		.object()
		.shape({
			siteAddress: sectionStateValidation(),
			ownsAllTheLand: sectionStateValidation(),
			agriculturalHolding: sectionStateValidation(),
			areYouATenant: sectionStateValidation(),
			tellingTheTenants: sectionStateValidation(),
			otherTenants: sectionStateValidation(),
			visibleFromRoad: sectionStateValidation(),
			healthAndSafety: sectionStateValidation(),
			someOfTheLand: sectionStateValidation(),
			knowTheOwners: sectionStateValidation(),
			identifyingTheLandOwners: sectionStateValidation(),
			advertisingYourAppeal: sectionStateValidation(),
			tellingTheLandowners: sectionStateValidation()
		})
		.noUnknown(true);
};

module.exports = { appealSiteSectionStateValidation };
