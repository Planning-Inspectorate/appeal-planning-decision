const { VIEW } = require('../../lib/views');

exports.getUseExistingServiceApplicationType = async (_, res) => {
	res.render(VIEW.BEFORE_YOU_START.USE_EXISTING_SERVICE_APPLICATION_TYPE, {
		acpLink: 'https://acp.planninginspectorate.gov.uk/'
	});
};
