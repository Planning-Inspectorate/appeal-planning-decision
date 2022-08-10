const pinsYup = require('../../../../../../lib/pins-yup');
const booleanValidation = require('../../../../generic-validators/boolean-validation');

const siteAccessValidation = () => {
	return pinsYup
		.object()
		.shape({
			canInspectorSeeWholeSiteFromPublicRoad: booleanValidation(),
			howIsSiteAccessRestricted: pinsYup.string().max(255).nullable()
		})
		.noUnknown(true);
};

module.exports = siteAccessValidation;
