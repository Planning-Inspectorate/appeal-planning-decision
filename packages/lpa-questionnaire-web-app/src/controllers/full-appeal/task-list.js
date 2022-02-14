const {
  constants: { APPEAL_ID, APPLICATION_DECISION },
} = require('@pins/business-rules');
const { renderView } = require('../../util/render');
const {
  VIEW: { TASK_LIST: taskListPath },
} = require('../../lib/full-appeal/views');
const { SECTIONS, getTaskStatus, TASK_SCOPE } = require('../../services/full-appeal/task.service');
const getAppealSideBarDetails = require('../../lib/common/appeal-sidebar-details');

const getDecisionOutcome = (appealType, appealDecisionOutcome) => {
  if (appealType === APPEAL_ID.PLANNING_SECTION_78) {
    if (appealDecisionOutcome === APPLICATION_DECISION.NODECISIONRECEIVED) {
      return TASK_SCOPE.NON_DETERMINISTIC;
    }
    return TASK_SCOPE.DETERMINISTIC;
  }
  return TASK_SCOPE.GENERIC;
};

/**
 * Builds tasks list and their status
 *
 * @param {Object} questionnaire - questionnaire that is retrieved from the database
 * @param {string} appealType - Appeal type the appellant selected during their eligibility journey
 * @param {string} appealDecisionOutcome - Appeal decision outcome the appellant selected during their eligibility journey
 * @return {Object} taskList - An object representing the tasks
 */
const buildTasksList = (questionnaire, appealType, appealDecisionOutcome) => {
  const taskList = [];

  const decisionOutcome = getDecisionOutcome(appealType, appealDecisionOutcome);

  Object.keys(SECTIONS).forEach((sectionKey) => {
    const status = getTaskStatus(questionnaire, sectionKey);
    const currentSection = SECTIONS[sectionKey];

    if (currentSection.scope ? currentSection.scope === decisionOutcome : true) {
      taskList.push({
        text: currentSection.displayText,
        href: currentSection.href,
        attributes: { name: sectionKey, [`${sectionKey}-status`]: status },
        status,
      });
    }
  });

  return taskList;
};

exports.getTaskList = (req, res) => {
  req.session.isCheckingAnswers = false;
  const { appeal, appealReply } = req.session;

  const sections = buildTasksList(
    appealReply,
    appeal.appealType,
    appeal.eligibility.applicationDecision,
    req
  );

  renderView(res, taskListPath, {
    prefix: 'appeal-questionnaire',
    appeal: getAppealSideBarDetails(appeal),
    'incomplete',
    completedTasksCount: sections.filter((section) => section.status === 'COMPLETED').length,
    totalTasksCount: sections.length,
    sections,
  });
};
