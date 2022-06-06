const { VIEW } = require('../../lib/submit-appeal/views');

exports.getEnterAppealDetails = async (_, res) => {
  res.render(VIEW.SUBMIT_APPEAL.ENTER_APPEAL_DETAILS, {});
};
