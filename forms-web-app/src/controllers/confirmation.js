const VIEW = {
  CONFIRMATION: 'confirmation/index',
};

exports.getConfirmation = (req, res) => {
  const appellantEmail = req.session && req.session.appeal && req.session.appeal['appellant-email'];
  res.render(VIEW.CONFIRMATION, {
    appellantEmail,
  });
};
