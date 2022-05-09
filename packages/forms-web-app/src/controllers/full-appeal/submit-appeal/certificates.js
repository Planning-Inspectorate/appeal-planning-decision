const { VIEW } = require('../../../lib/full-appeal/views');

const getCertificates = async (_, res) => {
  res.render(VIEW.FULL_APPEAL.CERTIFICATES);
};

const postCertificates = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;

  if (Object.keys(errors).length > 0) {
    return res.render(VIEW.FULL_APPEAL.CERTIFICATES, {
      errors,
      errorSummary,
    });
  }
};

module.exports = { getCertificates, postCertificates };
