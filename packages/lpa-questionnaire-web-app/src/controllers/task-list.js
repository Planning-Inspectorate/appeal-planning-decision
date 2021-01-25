const { getTaskStatus, SECTIONS } = require('../services/task.service');
const { VIEW } = require('../lib/views');
const countTasks = require('../lib/count-task');

const HEADERS = {
  aboutAppealSection: 'About the appeal',
  submissionAccuracy: "Review accuracy of the appellant's submission",
};

function buildTaskLists(questionnaire) {
  const taskList = [];
  const sections = SECTIONS;
  Object.keys(sections).forEach((sectionName) => {
    const section = sections[sectionName];

    const task = {
      heading: {
        text: HEADERS[sectionName],
      },
      items: [],
    };

    Object.keys(section).forEach((subSectionName) => {
      const subSection = section[subSectionName];

      const status = getTaskStatus(questionnaire, sectionName, subSectionName);

      task.items.push({
        text: HEADERS[subSectionName],
        href: subSection.href,
        attributes: {
          name: subSectionName,
          [`${subSectionName}-status`]: status,
        },
        status,
      });
    });
    taskList.push(task);
  });
  return taskList;
}

exports.getTaskList = (req, res) => {
  const { questionnaire } = req.session;
  const sections = buildTaskLists(questionnaire);

  const applicationStatus = 'Application incomplete';

  const sectionInfo = countTasks(sections);

  res.render(VIEW.TASK_LIST, {
    applicationStatus,
    sectionInfo,
    sections,
  });
};
