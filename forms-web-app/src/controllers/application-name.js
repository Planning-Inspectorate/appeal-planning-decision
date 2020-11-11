const VIEW = {
  APPLICATION_NAME: 'application-name/index',
};

exports.getApplicationName = (req, res) => {
  res.render(VIEW.APPLICATION_NAME);
};

exports.postApplicationName = (req, res) => {
  res.redirect('/task-list');
};
