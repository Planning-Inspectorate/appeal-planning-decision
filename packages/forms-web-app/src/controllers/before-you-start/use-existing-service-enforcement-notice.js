const { VIEW } = require('../../lib/views');

exports.getUseExistingServiceEnforcementNotice = async (_, res) => {
	res.render(VIEW.BEFORE_YOU_START.USE_EXISTING_SERVICE_ENFORCEMENT_NOTICE, {
		acpLink: 'https://acp.planninginspectorate.gov.uk/'
	});
};
