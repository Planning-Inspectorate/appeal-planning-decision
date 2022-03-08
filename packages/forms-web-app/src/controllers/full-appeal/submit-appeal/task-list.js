const { FULL_APPEAL_SECTIONS } = require('../../../services/task.service');
const { VIEW } = require('../../../lib/full-appeal/views');
const { NOT_STARTED } = require('../../../services/task-status/task-statuses');
const logger = require('../../../lib/logger');

const HEADERS = {
  contactDetailsSection: 'Provide your contact details',
  appealSiteSection: 'Tell us about the appeal site',
  appealDecisionSection: ' Tell us how you would prefer us to decide your appeal',
  planningApplicationDocumentsSection: 'Upload documents from your planning application',
  appealDocumentsSection: 'Upload documents for your appeal',
  submitYourAppealSection: 'Check your answers and submit your appeal',
};

function buildTaskLists(appeal) {
  const taskList = [];
  const { ...sections } = FULL_APPEAL_SECTIONS;

  Object.keys(sections).forEach((sectionName) => {
    const section = sections[sectionName];

    let status = NOT_STARTED;
    try {
      status = section.rule(appeal);
    } catch (e) {
      logger.error(e.message); // todo: this will be deleted at the end of the journey
    }

    taskList.push({
      text: HEADERS[sectionName],
      href: section.href,
      attributes: {
        name: sectionName,
        [`${sectionName}-status`]: status,
      },
      status,
    });
  });

  return taskList;
}

function countTasks(sections) {
  const nbTasks = sections.length;
  const nbCompleted = sections.filter((section) => section.status === 'COMPLETED').length;

  return {
    nbTasks,
    nbCompleted,
  };
}

exports.getTaskList = (req, res) => {
  const { appeal } = req.session;
  const sections = buildTaskLists(appeal);

  const applicationStatus = 'Appeal incomplete';

  const sectionInfo = countTasks(sections);

  res.render(VIEW.FULL_APPEAL.TASK_LIST, {
    applicationStatus,
    sectionInfo,
    sections,
  });
};
