const {
	VIEW: {
		HOUSEHOLDER_PLANNING: {
			ELIGIBILITY: { USE_EXISTING_SERVICE_COSTS: useExistingServiceCosts }
		}
	}
} = require('../../../lib/views');
const config = require('../../../config');

exports.getUseExistingServiceCosts = async (_, res) => {
	res.render(useExistingServiceCosts, {
		bannerHtmlOverride: config.betaBannerText,
		acpLink: 'https://acp.planninginspectorate.gov.uk/'
	});
};
