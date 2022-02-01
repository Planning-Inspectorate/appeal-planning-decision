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

const buildTasksList = (questionnaire, appealType, appealDecisionOutcome) => {
  const taskList = [];

  const decisionOutcome = getDecisionOutcome(appealType, appealDecisionOutcome);

  Object.keys(SECTIONS).forEach((sectionKey) => {
    const status = getTaskStatus(questionnaire, sectionKey);
    const currentSection = SECTIONS[sectionKey];
    const isSectionAvailable = currentSection.scope
      ? currentSection.scope === decisionOutcome
      : true;

    if (isSectionAvailable) {
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

const getTotalTasksCount = (sections) => {
  return sections.length;
};

const getCompletedTasksCount = (sections) => {
  return sections.filter((section) => section.status === 'COMPLETED').length;
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
  
  const questionnaireStatus = 'incomplete';

  renderView(res, taskListPath, {
    prefix: 'appeal-questionnaire',
    appeal: getAppealSideBarDetails(appeal),
    questionnaireStatus,
    completedTasksCount: getCompletedTasksCount(sections),
    totalTasksCount: getTotalTasksCount(sections),
    sections,
  });
};
