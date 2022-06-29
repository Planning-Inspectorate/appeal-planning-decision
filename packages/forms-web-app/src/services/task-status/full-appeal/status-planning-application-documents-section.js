const {
  constants: {
    APPLICATION_DECISION: { NODECISIONRECEIVED },
  },
} = require('@pins/business-rules');
const { getStatusOfPath, SectionPath } = require('../task-statuses');

const statusPlanningApplicationDocumentsSection = (appeal) => {
  const {
    typeOfPlanningApplication,
    eligibility: { applicationDecision },
    planningApplicationDocumentsSection: { designAccessStatement },
  } = appeal;
  const section = appeal.sectionStates.planningApplicationDocumentsSection;

  const sectionPath = new SectionPath(section);

  if (
    typeOfPlanningApplication === 'removal-or-variation-of-conditions' &&
    applicationDecision === NODECISIONRECEIVED
  ) {
    sectionPath.add('originalDecisionNotice');
  }

  sectionPath
    .add('originalApplication')
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
