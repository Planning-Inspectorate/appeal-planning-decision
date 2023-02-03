const pinsYup = require('../../../../../../lib/pins-yup');
const booleanValidation = require('../../../../../components/boolean-validation');

const siteAccessValidation = () => {
	return pinsYup
		.object()
		.shape({
			canInspectorSeeWholeSiteFromPublicRoad: booleanValidation(),
			howIsSiteAccessRestricted: pinsYup.string().max(1000).nullable()
		})
		.noUnknown(true);
};

module.exports = siteAccessValidation;
