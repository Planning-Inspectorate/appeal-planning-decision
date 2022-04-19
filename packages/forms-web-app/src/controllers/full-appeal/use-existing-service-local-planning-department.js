const { VIEW } = require('../../lib/views');

exports.getUseExistingServiceLocalPlanningDepartment = async (_, res) => {
  res.render(VIEW.FULL_APPEAL.USE_EXISTING_SERVICE_LOCAL_PLANNING_DEPARTMENT, {
    acpLink: 'https://acp.planninginspectorate.gov.uk/',
  });
};
