exports.getCheckAnswers = (req, res) => {
  res.render('check-answers/index', {
    appeal: req.session.appeal,
  });
};
