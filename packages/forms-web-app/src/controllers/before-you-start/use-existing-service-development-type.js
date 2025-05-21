const {
	VIEW: {
		BEFORE_YOU_START: { USE_EXISTING_SERVICE_DEVELOPMENT_TYPE: useExistingServiceDevelopmentType }
	}
} = require('../../lib/views');

exports.getExistingServiceDevelopmentType = async (_, res) => {
	res.render(useExistingServiceDevelopmentType, {
		acpLink: 'https://acp.planninginspectorate.gov.uk/'
	});
};
