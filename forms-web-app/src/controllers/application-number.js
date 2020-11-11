const VIEW = {
  APPLICATION_NUMBER: 'application-number/index',
};

exports.getApplicationNumber = (req, res) => {
  res.render(VIEW.APPLICATION_NUMBER);
};

exports.postApplicationNumber = (req, res) => {
  res.redirect('/task-list');
};
