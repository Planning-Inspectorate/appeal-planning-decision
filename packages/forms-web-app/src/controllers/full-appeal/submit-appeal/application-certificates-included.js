const { VIEW } = require('../../../lib/full-appeal/views');
const { COMPLETED } = require('../../../services/task-status/task-statuses');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');

const logger = require('../../../lib/logger');

const backLink = `/${VIEW.FULL_APPEAL.APPLICATION_FORM}`;
const sectionName = 'planningApplicationDocumentsSection';
const taskName = 'ownershipCertificate';

const getApplicationCertificatesIncluded = async (req, res) => {
  const { submittedSeparateCertificate } = req.session.appeal[sectionName][taskName];
  res.render(VIEW.FULL_APPEAL.APPLICATION_CERTIFICATES_INCLUDED, {
    backLink,
    submittedSeparateCertificate,
  });
};

const postApplicationCertificatesIncluded = async (req, res) => {
  const {
    body,
    session: { appeal },
  } = req;
  const { errors = {}, errorSummary = [] } = body;

  if (Object.keys(errors).length > 0) {
    return res.render(VIEW.FULL_APPEAL.APPLICATION_CERTIFICATES_INCLUDED, {
      errors,
      errorSummary,
      backLink,
    });
  }

  const submittedSeparateCertificate = body['did-you-submit-separate-certificate'] === 'yes';

  try {
    appeal[sectionName][taskName].submittedSeparateCertificate = submittedSeparateCertificate;
    appeal.sectionStates[sectionName][taskName] = COMPLETED;
    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (err) {
    logger.error(err);
    return res.render(VIEW.FULL_APPEAL.APPLICATION_CERTIFICATES_INCLUDED, {
      submittedSeparateCertificate,
      errors,
      errorSummary: [{ text: err.toString(), href: '#' }],
    });
  }

  return submittedSeparateCertificate
    ? res.redirect(`/${VIEW.FULL_APPEAL.CERTIFICATES}`)
    : res.redirect(`/${VIEW.FULL_APPEAL.APPLICATION_NUMBER}`);
};

module.exports = { getApplicationCertificatesIncluded, postApplicationCertificatesIncluded };
