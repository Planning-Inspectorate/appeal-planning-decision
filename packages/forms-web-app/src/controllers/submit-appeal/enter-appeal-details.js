const logger = require('../../lib/logger');
const { VIEW } = require('../../lib/submit-appeal/views');

// dummy method: remove and replace with import for valid method when built
exports.sendEmailWithCode = async (email, number) => {
  return;
};

exports.getEnterAppealDetails = async (_, res) => {
  res.render(VIEW.SUBMIT_APPEAL.ENTER_APPEAL_DETAILS);
};

exports.postEnterAppealDetails = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;
  const emailAddress = body['appellant-email'];
  const applicationNumber = body['application-number'];

  if (Object.keys(errors).length > 0) {
    res.render(VIEW.SUBMIT_APPEAL.ENTER_APPEAL_DETAILS, {
      emailAddress: emailAddress,
      applicationNumber: applicationNumber,
      errors,
      errorSummary,
    });
    return;
  }

  try {
    // replace below with valid method when built
    await exports.sendEmailWithCode(emailAddress, applicationNumber);
  } catch (e) {
    logger.error(e);
    res.render(VIEW.SUBMIT_APPEAL.ENTER_APPEAL_DETAILS, {
      emailAddress: emailAddress,
      applicationNumber: applicationNumber,
      errorSummary: [{ text: e.toString(), href: '#' }],
    });
    return;
  }

  // view below not yet built
  res.redirect(VIEW.SUBMIT_APPEAL.ENTER_CODE);
};
