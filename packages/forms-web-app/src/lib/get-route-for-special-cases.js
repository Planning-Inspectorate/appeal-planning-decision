const checkSpecialCases = {
  checkIfDecisionNoticeRequired: (appeal, sectionName) => {
    return sectionName === 'planningApplicationDocumentsSection' &&
      appeal.typeOfPlanningApplication === 'removal-or-variation-of-conditions' &&
      appeal.eligibility.applicationDecision === 'nodecisionreceived'
      ? '/full-appeal/submit-appeal/original-decision-notice'
      : '';
  },
};

function getHref(appeal, sectionName, section) {
  let href;
  Object.keys(checkSpecialCases).forEach((rule) => {
    href = checkSpecialCases[rule](appeal, sectionName);
  });
  return href !== '' ? href : section.href;
}

module.exports = {
  getHref,
};
