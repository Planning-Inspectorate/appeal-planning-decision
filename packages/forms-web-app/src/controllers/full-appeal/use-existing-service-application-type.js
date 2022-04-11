const { VIEW } = require('../../lib/views');

exports.getUseExistingServiceApplicationType = async (_, res) => {
  res.render(VIEW.FULL_APPEAL.USE_EXISTING_SERVICE_APPLICATION_TYPE, {
    acpLink: 'https://acp.planninginspectorate.gov.uk/',
  });
};
