const { APPEAL_ID } = require('@pins/business-rules/src/constants');

module.exports = (application) => {
  switch (application) {
    case 'full-appeal':
      return APPEAL_ID.PLANNING_SECTION_78;

    case 'householder-planning':
      return APPEAL_ID.HOUSEHOLDER;

    default:
      return undefined;
  }
};
