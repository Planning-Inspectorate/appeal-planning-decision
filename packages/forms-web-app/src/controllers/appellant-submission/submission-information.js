const { VIEW } = require('../../lib/views');

exports.getSubmissionInformation = async (req, res) => {
  const { appeal, appealLPD } = req.session;

  if (!appeal) {
    res.status(404);
    return res.render('error/not-found');
  }

  if (!appealLPD) {
    res.status(400);
    return res.render('error/400', {
      message: 'Unable to locate the Local Planning Department for the given LPA Code.',
    });
  }

  return res.render(VIEW.APPELLANT_SUBMISSION.SUBMISSION_INFORMATION, {
    appealLPD,
    appeal,
  });
};
