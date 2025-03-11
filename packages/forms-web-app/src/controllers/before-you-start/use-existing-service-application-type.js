const { VIEW } = require('../../lib/views');
const config = require('../../config');

exports.getUseExistingServiceApplicationType = async (_, res) => {
	res.render(VIEW.BEFORE_YOU_START.USE_EXISTING_SERVICE_APPLICATION_TYPE, {
		bannerHtmlOverride: config.betaBannerText,
		acpLink: 'https://acp.planninginspectorate.gov.uk/'
	});
};
