const config = require('../config');

const { VIEW } = require('../lib/views');
const magicLinkAPIWrapper = require('../lib/magiclink-api-wrapper');
const { isEmailWithinDomain } = require('../lib/email-validation');

function createMagicLinkAPIPayload(req) {
  const email = req.body?.email;
  const lpaCode = req.lpa.id;
  const redirectURL = req.session?.redirectURL;

  return {
    magicLink: {
      redirectURL,
      expiredLinkRedirectURL: `${req.protocol}://${req.get(
        'host'
      )}/${lpaCode}/authentication/your-email/link-expired`,
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
  const isLinkedExpired = req.params.error === 'link-expired';
  const lpaName = req.lpa.name;

  return res.render(VIEW.AUTHENTICATION.ENTER_EMAIL_ADDRESS, {
    isSessionExpired,
    isLinkedExpired,
    lpaName,
    enterEmailLink: `/${req.params.lpaCode}/${VIEW.AUTHENTICATION.ENTER_EMAIL_ADDRESS}`,
  });
}

async function processEmailAddress(req, res) {
  req.log.debug('Enter process email address controller');
  const email = req.body?.email;
  const { lpa } = req;

  if (isEmailWithinDomain(email, lpa.domain)) {
    const magicLinkPayload = createMagicLinkAPIPayload(req);
    await magicLinkAPIWrapper.createMagicLink(magicLinkPayload);
    req.log.debug(`Magic link authentication request executed with success.`);
  }

  req.session.email = email;
  res.redirect(`/${req.params.lpaCode}/${VIEW.AUTHENTICATION.EMAIL_ADDRESS_CONFIRMATION}`);
}

function showEmailConfirmation(req, res) {
  req.log.debug('Enter show email confirmation controller');

  return res.render(VIEW.AUTHENTICATION.EMAIL_ADDRESS_CONFIRMATION, {
    email: req.session?.email,
    enterEmailLink: `/${req.params.lpaCode}/${VIEW.AUTHENTICATION.ENTER_EMAIL_ADDRESS}`,
  });
}

module.exports = {
  processEmailAddress,
  showEnterEmailAddress,
  showEmailConfirmation,
};
