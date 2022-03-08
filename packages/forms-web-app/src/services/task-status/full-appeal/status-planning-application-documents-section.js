const { getStatusOfPath, SectionPath } = require('../task-statuses');

const statusPlanningApplicationDocumentsSection = (appeal) => {
  const { designAccessStatement } = appeal.planningApplicationDocumentsSection;
  const section = appeal.sectionStates.planningApplicationDocumentsSection;

  const sectionPath = new SectionPath(section)
    .add('originalApplication')
    .add('applicationNumber')
    .add('plansDrawingsSupportingDocuments')
    .add('designAccessStatementSubmitted')
    .add('decisionLetter');

  if (designAccessStatement?.isSubmitted) {
    sectionPath.add('designAccessStatement');
  }

  return getStatusOfPath(sectionPath.getPath());
};

module.exports = {
  statusPlanningApplicationDocumentsSection,
};
