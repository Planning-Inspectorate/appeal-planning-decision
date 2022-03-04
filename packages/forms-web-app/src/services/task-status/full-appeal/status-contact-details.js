const { getStatusOfPath, SectionPath } = require('../task-statuses');

const statusContactDetails = (appeal) => {
  const { isOriginalApplicant } = appeal.contactDetailsSection;
  const section = appeal.sectionStates.contactDetailsSection;

  const sectionPath = new SectionPath(section).add('isOriginalApplicant');

  if (isOriginalApplicant) {
    sectionPath.add('contact');
  } else {
    sectionPath.add('appealingOnBehalfOf').add('contact');
  }

  return getStatusOfPath(sectionPath.getPath());
};

module.exports = {
  statusContactDetails,
};
