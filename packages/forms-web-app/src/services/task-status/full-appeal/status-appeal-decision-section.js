const { PROCEDURE_TYPE } = require('@pins/business-rules/src/constants');
const { getStatusOfPath, SectionPath } = require('../task-statuses');

const statusAppealDecisionSection = (appeal) => {
  const { procedureType } = appeal.appealDecisionSection;
  const section = appeal.sectionStates.appealDecisionSection;

  const sectionPath = new SectionPath(section).add('procedureType');

  if (procedureType !== PROCEDURE_TYPE.WRITTEN_REPRESENTATION) {
    sectionPath.add('draftStatementOfCommonGround');
    if (procedureType === PROCEDURE_TYPE.HEARING) {
      sectionPath.add('hearing');
    } else {
      sectionPath.add('inquiry').add('inquiryExpectedDays');
    }
  }

  return getStatusOfPath(sectionPath.getPath());
};

module.exports = {
  statusAppealDecisionSection,
};
