const { VIEW } = require('../../../lib/full-appeal/views');

const getCertificates = async (_, res) => {
  res.render(VIEW.FULL_APPEAL.CERTIFICATES);
};

module.exports = { getCertificates };
