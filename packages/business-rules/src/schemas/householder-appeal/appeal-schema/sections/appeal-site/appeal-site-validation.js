const pinsYup = require('../../../../../lib/pins-yup');
const healthAndSafetyValidation = require('./health-and-safety/health-and-safety-validation');
const siteAccessValidation = require('./site-access/site-access-validation');
const siteAddressValidation = require('./site-address/site-address-validation');
const siteOwnershipValidation = require('./site-ownership/site-ownership-validation');

const appealSiteValidation = () => {
	return pinsYup.object().shape({
		siteAddress: siteAddressValidation(),
		siteOwnership: siteOwnershipValidation(),
		siteAccess: siteAccessValidation(),
		healthAndSafety: healthAndSafetyValidation()
	});
};

module.exports = appealSiteValidation;
