const { VIEW } = require('../../lib/views');

exports.getCannotUseThisService = async (_, res) => {
	res.render(VIEW.BEFORE_YOU_START.CANNOT_USE_THIS_SERVICE, {
		acpLink: 'https://acp.planninginspectorate.gov.uk/'
	});
};
