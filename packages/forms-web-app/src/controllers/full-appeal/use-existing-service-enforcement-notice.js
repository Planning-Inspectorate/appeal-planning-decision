const { VIEW } = require('../../lib/views');
const config = require('../../config');

exports.getUseExistingServiceEnforcementNotice = async (_, res) => {
	res.render(VIEW.BEFORE_YOU_START.USE_EXISTING_SERVICE_ENFORCEMENT_NOTICE, {
		bannerHtmlOverride: config.betaBannerText,
		acpLink: 'https://acp.planninginspectorate.gov.uk/'
	});
};
