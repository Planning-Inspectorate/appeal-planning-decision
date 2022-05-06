const {
  constants: {
    APPLICATION_DECISION: { NODECISIONRECEIVED },
  },
} = require('@pins/business-rules');
const { getStatusOfPath, SectionPath } = require('../task-statuses');

const statusPlanningApplicationDocumentsSection = (appeal) => {
  const {
    eligibility: { applicationDecision },
    planningApplicationDocumentsSection: { designAccessStatement },
  } = appeal;
  const section = appeal.sectionStates.planningApplicationDocumentsSection;

  const sectionPath = new SectionPath(section)
    .add('originalApplication')
    .add('applicationNumber')
    .add('plansDrawingsSupportingDocuments')
    .add('designAccessStatementSubmitted');

  if (designAccessStatement?.isSubmitted) {
    sectionPath.add('designAccessStatement');
  }

  if (applicationDecision !== NODECISIONRECEIVED) {
    sectionPath.add('decisionLetter');
  }

  return getStatusOfPath(sectionPath.getPath());
};

module.exports = {
  statusPlanningApplicationDocumentsSection,
};
