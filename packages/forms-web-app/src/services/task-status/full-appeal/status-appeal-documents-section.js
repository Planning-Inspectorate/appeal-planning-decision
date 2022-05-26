const { getStatusOfPath, SectionPath } = require('../task-statuses');

const statusAppealDocumentsSection = (appeal) => {
  const { plansDrawings, supportingDocuments } = appeal.appealDocumentsSection;
  const section = appeal.sectionStates.appealDocumentsSection;

  const sectionPath = new SectionPath(section)
    .add('appealStatement')
    .add('newPlansDrawings')
    .add('supportingDocuments');

  if (plansDrawings?.hasPlansDrawings) {
    sectionPath.add('plansDrawings');
  }

  if (supportingDocuments?.hasSupportingDocuments) {
    sectionPath.add('newSupportingDocuments');
  }

  return getStatusOfPath(sectionPath.getPath());
};

module.exports = {
  statusAppealDocumentsSection,
};
