const { VIEW } = require('../../lib/views');
const config = require('../../config');

exports.getUseADifferentService = async (_, res) => {
	res.render(VIEW.FULL_APPEAL.USE_A_DIFFERENT_SERVICE, {
		bannerHtmlOverride: config.betaBannerText,
		acpLink: 'https://acp.planninginspectorate.gov.uk/'
	});
};
