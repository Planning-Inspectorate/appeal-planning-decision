const { VIEW } = require('../../lib/views');

exports.getUseADifferentService = async (_, res) => {
  res.render(VIEW.FULL_APPEAL.USE_A_DIFFERENT_SERVICE, {
    acpLink: 'https://acp.planninginspectorate.gov.uk/',
  });
};
