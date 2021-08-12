const { VIEW } = require('../lib/views');

function showEnterEmailAddress(req, res) {
  const isSessionExpired = req.params.error === 'session-expired';
  const isLinkedExpired = req.params.error === 'link-expired';

  return res.render(VIEW.AUTHENTICATION.ENTER_EMAIL_ADDRESS, {
    isSessionExpired,
    isLinkedExpired,
    lpaName: 'testLPA',
    enterEmailLink: `/${req.params.lpaCode}/${VIEW.AUTHENTICATION.ENTER_EMAIL_ADDRESS}`,
  });
}

function processEmailAddress(req, res) {
  req.session.email = req.body?.email;
  res.redirect(`/${req.params.lpaCode}/${VIEW.AUTHENTICATION.EMAIL_ADDRESS_CONFIRMATION}`);
}

function showEmailConfirmation(req, res) {
  return res.render(VIEW.AUTHENTICATION.EMAIL_ADDRESS_CONFIRMATION, {
    tokenExpirationTime: '15 minutes',
    email: req.session?.email,
    enterEmailLink: `/${req.params.lpaCode}/${VIEW.AUTHENTICATION.ENTER_EMAIL_ADDRESS}`,
  });
}

module.exports = {
  processEmailAddress,
  showEnterEmailAddress,
  showEmailConfirmation,
};
