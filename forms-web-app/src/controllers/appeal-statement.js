const VIEW = {
  APPEAL_STATEMENT: 'eligibility/appeal-statement',
};

exports.getAppealStatement = (req, res) => {
  res.render(VIEW.APPEAL_STATEMENT);
};
