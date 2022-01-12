const { getTaskStatus, FULL_APPEAL_SECTIONS } = require('../../../services/task.service');
const { VIEW } = require('../../../lib/full-appeal/views');

const HEADERS = {
  contactDetailsSection: 'Provide your contact details',
  aboutAppealSiteSection: 'Tell us about the appeal site',
  planningApplicationDocumentsSection: 'Upload documents from your planning application',
  appealDocumentsSection: 'Upload documents for your appeal',
  submitYourAppealSection: 'Check your answers and submit your appeal',
};

function buildTaskLists(appeal) {
  const taskList = [];
  const { requiredDocumentsSection, appealSiteSection, aboutYouSection, ...sections } =
    FULL_APPEAL_SECTIONS;

  Object.keys(sections).forEach((sectionName) => {
    const section = sections[sectionName];

    const status = getTaskStatus(appeal, sectionName, undefined, FULL_APPEAL_SECTIONS);

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

  const applicationStatus = 'Application incomplete';

  const sectionInfo = countTasks(sections);

  res.render(VIEW.FULL_APPEAL.TASK_LIST, {
    applicationStatus,
    sectionInfo,
    sections,
  });
};
