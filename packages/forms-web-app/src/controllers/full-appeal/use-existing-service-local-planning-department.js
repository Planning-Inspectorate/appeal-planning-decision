const { VIEW } = require('../../lib/views');
const config = require('../../config');

exports.getUseExistingServiceLocalPlanningDepartment = async (_, res) => {
	res.render(VIEW.FULL_APPEAL.USE_EXISTING_SERVICE_LOCAL_PLANNING_DEPARTMENT, {
		bannerHtmlOverride: config.betaBannerText,
		acpLink: 'https://acp.planninginspectorate.gov.uk/'
	});
};
