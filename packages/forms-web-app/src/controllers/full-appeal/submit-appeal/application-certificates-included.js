const { VIEW } = require('../../../lib/full-appeal/views');

const backLink = `/${VIEW.FULL_APPEAL.APPLICATION_FORM}`;

const getApplicationCertificatesIncluded = async (_, res) => {
  res.render(VIEW.FULL_APPEAL.APPLICATION_CERTIFICATES_INCLUDED, { backLink });
};

const postApplicationCertificatesIncluded = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;

  if (Object.keys(errors).length > 0) {
    return res.render(VIEW.FULL_APPEAL.APPLICATION_CERTIFICATES_INCLUDED, {
      errors,
      errorSummary,
      backLink,
    });
  }

  const hasCertificates = body['do-you-have-certificates'] === 'yes';

  return hasCertificates
    ? res.redirect(`/${VIEW.FULL_APPEAL.APPLICATION_NUMBER}`)
    : res.redirect(`/${VIEW.FULL_APPEAL.CERTIFICATES}`);
};

module.exports = { getApplicationCertificatesIncluded, postApplicationCertificatesIncluded };
