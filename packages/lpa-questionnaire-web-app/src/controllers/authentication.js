const config = require('../config');

const { VIEW } = require('../lib/views');
const magicLinkAPIWrapper = require('../lib/magiclink-api-wrapper');
const { isEmailWithinDomain } = require('../lib/email-validation');
const { renderView } = require('../util/render');

function createMagicLinkAPIPayload(req) {
  const email = req.body?.email;
  const lpaCode = req.lpa.id;
  const redirectURL = req.session?.redirectURL;

  req.log.debug(`Des - req.session - ${JSON.stringify(req.session)}`);
  req.log.debug(`Des - redirectURL - ${redirectURL}`);

  return {
    magicLink: {
      redirectURL,
      expiredLinkRedirectURL: `${req.protocol}://${req.get(
        'host'
      )}/appeal-questionnaire/${lpaCode}/authentication/your-email/link-expired`,
      destinationEmail: email,
    },
    auth: {
      userInformation: {
        email,
        lpaCode,
      },
      tokenValidity: config.auth.tokenValidityMillis,
      cookieName: config.auth.tokenCookieName,
    },
  };
}

function showEnterEmailAddress(req, res) {
  req.log.debug('Enter show email address controller');
  const isSessionExpired = req.params.error === 'session-expired';
  const isLinkExpired = req.params.error === 'link-expired';
  const lpaName = req.lpa.name;

  req.session = req.session || {};
  req.session.redirectURL = req.session.redirectURL || req.query?.redirectURL;

  return res.render(VIEW.AUTHENTICATION.ENTER_EMAIL_ADDRESS, {
    isSessionExpired,
    isLinkExpired,
    lpaName,
    enterEmailLink: `/appeal-questionnaire/${req.params.lpaCode}/${VIEW.AUTHENTICATION.ENTER_EMAIL_ADDRESS}`,
  });
}

async function processEmailAddress(req, res) {
  req.log.debug('Enter process email address controller');
  const email = req.body?.email;
  const { lpa } = req;
  const { errors = {}, errorSummary = [] } = req.body;

  const isSessionExpired = req.body?.hidIsSessionExpired === 'true';
  const isLinkExpired = req.body?.hidIsLinkedExpired === 'true';
  const lpaName = req.lpa.name;

  if (Object.keys(errors).length > 0) {
    renderView(res, VIEW.AUTHENTICATION.ENTER_EMAIL_ADDRESS, {
      isSessionExpired,
      isLinkExpired,
      lpaName,
      enterEmailLink: `/appeal-questionnaire/${req.params.lpaCode}/${VIEW.AUTHENTICATION.ENTER_EMAIL_ADDRESS}`,
      errors,
      errorSummary,
    });

    return;
  }

  if (isEmailWithinDomain(email, lpa.domain)) {
    const magicLinkPayload = createMagicLinkAPIPayload(req);
    await magicLinkAPIWrapper.createMagicLink(magicLinkPayload);
    req.log.debug(`Magic link authentication request executed with success.`);
  } else {
    req.log.debug(`Email provided does not belong to the lpa ${lpa.domain}.`);
  }

  req.session.email = email;
  res.redirect(
    `/appeal-questionnaire/${req.params.lpaCode}/${VIEW.AUTHENTICATION.EMAIL_ADDRESS_CONFIRMATION}`
  );
}

function showEmailConfirmation(req, res) {
  req.log.debug('Enter show email confirmation controller');

  return res.render(VIEW.AUTHENTICATION.EMAIL_ADDRESS_CONFIRMATION, {
    email: req.session?.email,
    enterEmailLink: `/appeal-questionnaire/${req.params.lpaCode}/${VIEW.AUTHENTICATION.ENTER_EMAIL_ADDRESS}`,
  });
}

module.exports = {
  processEmailAddress,
  showEnterEmailAddress,
  showEmailConfirmation,
};
