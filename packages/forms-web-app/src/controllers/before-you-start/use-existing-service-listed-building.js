const {
	VIEW: {
		BEFORE_YOU_START: { USE_EXISTING_SERVICE_LISTED_BUILDING: useExistingServiceListedBuilding }
	}
} = require('../../lib/views');
const config = require('../../config');

exports.getUseExistingServiceListedBuilding = async (_, res) => {
	res.render(useExistingServiceListedBuilding, {
		bannerHtmlOverride: config.betaBannerText,
		acpLink: 'https://acp.planninginspectorate.gov.uk/'
	});
};
