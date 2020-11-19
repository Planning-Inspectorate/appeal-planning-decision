const { VIEW } = require('../lib/views');

exports.getCheckAnswers = (req, res) => {
  res.render(VIEW.CHECK_ANSWERS, {
    appeal: req.session.appeal,
  });
};
