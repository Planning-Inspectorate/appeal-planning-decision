const { HEADERS, SECTIONS } = require('../services/task.service');
const { VIEW } = require('../lib/views');

/**
 * @name buildTaskLists
 * @description Builds array of section objects, each has an array of tasks
 * @param questionnaire Questionnaire details from request
 * @return {array} Array of section objects
 */
function buildTaskLists(questionnaire) {
  return SECTIONS.map(({ sectionId, tasks }) => {
    return {
      heading: {
        text: HEADERS[sectionId],
      },
      tasks: tasks.map(({ taskId, href, rule }) => {
        const status = rule(questionnaire);

        return {
          text: HEADERS[taskId],
          href,
          attributes: {
            name: taskId,
            [`${taskId}-status`]: status,
          },
          status,
        };
      }),
    };
  });
}

exports.getTaskList = (req, res) => {
  const { questionnaire } = req.session;
  const sections = buildTaskLists(questionnaire);
  const applicationStatus = 'Application incomplete';

  res.render(VIEW.TASK_LIST, {
    applicationStatus,
    sections,
  });
};
