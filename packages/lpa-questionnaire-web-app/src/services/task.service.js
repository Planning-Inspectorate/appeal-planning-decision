const { VIEW } = require('../lib/views');
const TASK_STATUS = require('./task-status/task-statuses');

function statusTemp() {
  // TODO: these will be replaces when we have checks for status of each step
  return TASK_STATUS.NOT_STARTED;
}

const SECTIONS = {
  aboutAppealSection: {
    submissionAccuracy: {
      href: '#',
      rule: statusTemp,
    },
  },
};

const getTaskStatus = (questionnaire, sectionName, taskName, sections = SECTIONS) => {
  try {
    const { rule } = sections[sectionName][taskName];
    return rule(questionnaire);
  } catch (e) {
    return null;
  }
};

// Get next section task
const getNextTask = () => {
  return { href: `/${VIEW.TASK_LIST}` };
};

module.exports = {
  SECTIONS,
  getTaskStatus,
  getNextTask,
};
