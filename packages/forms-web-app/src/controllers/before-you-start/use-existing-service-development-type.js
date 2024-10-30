const {
	VIEW: {
		BEFORE_YOU_START: { USE_EXISTING_SERVICE_DEVELOPMENT_TYPE: useExistingServiceDevelopmentType }
	}
} = require('../../lib/views');
const config = require('../../config');

exports.getExistingServiceDevelopmentType = async (_, res) => {
	res.render(useExistingServiceDevelopmentType, {
		bannerHtmlOverride: config.betaBannerText,
		acpLink: 'https://acp.planninginspectorate.gov.uk/'
	});
};
