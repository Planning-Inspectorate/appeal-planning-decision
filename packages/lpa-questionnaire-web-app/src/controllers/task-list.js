const { HEADERS, SECTIONS, DESCRIPTIONS } = require('../services/task.service');
const { VIEW } = require('../lib/views');

/**
 * @name buildTaskLists
 * @description Builds array of section objects, each has an array of tasks
 * @param appealReply Reply details from request
 * @return {array} Array of section objects
 */
function buildTaskLists(appealReply, appealId) {
  return SECTIONS.map(({ sectionId, tasks }) => {
    return {
      heading: {
        text: HEADERS[sectionId],
      },
      description: DESCRIPTIONS[sectionId],
      attributes: {
        'data-cy': `task-list--${sectionId}`,
      },
      tasks: tasks.map(({ taskId, href, rule }) => {
        const status = rule(appealReply, taskId);

        return {
          text: HEADERS[taskId],
          href: `/${appealId}${href}`,
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
  const { appealReply } = req.session;
  const sections = buildTaskLists(appealReply, req.params.id);
  const applicationStatus = 'Application incomplete';

  // Set backLink property in session
  req.session.backLink = `/${req.params.id}/${VIEW.TASK_LIST}`;

  res.render(VIEW.TASK_LIST, {
    applicationStatus,
    sections,
  });
};
