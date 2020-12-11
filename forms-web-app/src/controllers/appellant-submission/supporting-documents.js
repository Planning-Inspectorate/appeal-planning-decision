const { VIEW } = require('../../lib/views');

// const sectionName = 'yourAppealSection';
// const taskName = 'otherDocuments';

exports.getSupportingDocuments = (req, res) => {
  console.log(JSON.stringify(req.session.appeal, null, 2), 'req.session.appeal getSupportingDocuments')

  res.render(VIEW.APPELLANT_SUBMISSION.SUPPORTING_DOCUMENTS);
};
