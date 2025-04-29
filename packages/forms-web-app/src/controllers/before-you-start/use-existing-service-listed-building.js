const {
	VIEW: {
		BEFORE_YOU_START: { USE_EXISTING_SERVICE_LISTED_BUILDING: useExistingServiceListedBuilding }
	}
} = require('../../lib/views');

exports.getUseExistingServiceListedBuilding = async (_, res) => {
	res.render(useExistingServiceListedBuilding, {
		acpLink: 'https://acp.planninginspectorate.gov.uk/'
	});
};
