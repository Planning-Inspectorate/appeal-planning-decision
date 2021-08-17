const { HEADERS, SECTIONS, DESCRIPTIONS } = require('../services/task.service');
const { VIEW } = require('../lib/views');
const { renderView } = require('../util/render');

/**
 * @name buildTaskLists
 * @description Builds array of section objects, each has an array of tasks
 * @param appealReply Reply details from request
 * @return {array} Array of section objects
 */
function buildTaskLists(appealReply, appealId) {
  return SECTIONS.map(({ sectionId, prefix, tasks }) => {
    return {
      heading: {
        text: HEADERS[sectionId],
      },
      description: DESCRIPTIONS[sectionId],
      attributes: {
        'data-cy': `task-list--${sectionId}`,
      },
      tasks: tasks.map(({ taskId, href, rule }) => {
        const status = rule(appealReply, taskId, sectionId);

        return {
          text: HEADERS[taskId],
          href: `${prefix}/${appealId}${href}`,
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
  req.session.isCheckingAnswers = false;
  const { appealReply } = req.session;
  const sections = buildTaskLists(appealReply, req.params.id);
  const applicationStatus = 'Application incomplete';

  // Set backLink property in session
  req.session.backLink = `/appeal-questionnaire/${req.params.id}/${VIEW.TASK_LIST}`;

  renderView(res, VIEW.TASK_LIST, {
    prefix: 'appeal-questionnaire',
    applicationStatus,
    sections,
  });
};
