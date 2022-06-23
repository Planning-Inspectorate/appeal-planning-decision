const {
  VIEW: {
    FULL_APPEAL: { CONFIRM_EMAIL_ADDRESS },
  },
} = require('../../../lib/full-appeal/views');

const getConfirmEmailAddress = (req, res) => {
  res.render(CONFIRM_EMAIL_ADDRESS, {
    emailAddress: req.session.appeal.emailAddress,
  });
};

module.exports = { getConfirmEmailAddress };
