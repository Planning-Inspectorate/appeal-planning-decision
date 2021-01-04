const { VIEW } = require('../../lib/views');

// const sectionName = 'yourAppealSection';
// const taskName = 'otherDocuments';

exports.getSupportingDocuments = (req, res) => {
  res.render(VIEW.APPELLANT_SUBMISSION.SUPPORTING_DOCUMENTS);
};
