const { VIEW } = require('../../../lib/full-appeal/views');

const getPlanningObligationStatus = async (_, res) => {
  res.render(VIEW.FULL_APPEAL.PLANNING_OBLIGATION_STATUS);
};

module.exports = { getPlanningObligationStatus };
