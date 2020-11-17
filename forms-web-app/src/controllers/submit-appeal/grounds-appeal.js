const VIEW = {
  GROUNDS_OF_APPEAL: 'submit-appeal/grounds',
};

exports.getGroundsOfAppeal = (req, res) => {
  res.render(VIEW.GROUNDS_OF_APPEAL);
};
