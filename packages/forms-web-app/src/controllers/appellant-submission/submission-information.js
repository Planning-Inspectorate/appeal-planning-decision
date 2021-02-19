const fs = require('fs');
const path = require('path');
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

  const css = fs.readFileSync(path.resolve(__dirname, '../../public/stylesheets/main.css'), 'utf8');

  return res.render(VIEW.APPELLANT_SUBMISSION.SUBMISSION_INFORMATION, {
    appealLPD: appealLPD.name,
    appeal,
    css,
  });
};
