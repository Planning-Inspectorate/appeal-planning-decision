const {
	VIEW: {
		HOUSEHOLDER_PLANNING: {
			ELIGIBILITY: { USE_EXISTING_SERVICE_COSTS: useExistingServiceCosts }
		}
	}
} = require('../../../lib/views');

exports.getUseExistingServiceCosts = async (_, res) => {
	res.render(useExistingServiceCosts, {
		acpLink: 'https://acp.planninginspectorate.gov.uk/'
	});
};
