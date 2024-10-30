const { VIEW } = require('../../lib/views');
const config = require('../../config');

exports.getUseExistingServiceApplicationType = async (_, res) => {
	res.render(VIEW.FULL_APPEAL.USE_EXISTING_SERVICE_APPLICATION_TYPE, {
		bannerHtmlOverride: config.betaBannerText,
		acpLink: 'https://acp.planninginspectorate.gov.uk/'
	});
};
