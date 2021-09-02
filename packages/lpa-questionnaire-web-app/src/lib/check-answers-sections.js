const { HEADERS, CHECK_ANSWERS, SECTIONS } = require('../services/task.service');

const getFileListHtml = (files) => {
  const filesHtml = files.map((file) => `<li>${file.name}</li>`);

  return filesHtml.length
    ? `<ul class="govuk-list">${filesHtml.join('')}</ul>`
    : '<p>No files uploaded</p>';
};

const getValueText = (value) => {
  if (typeof value === 'boolean') return `<p>${value ? 'Yes' : 'No'}</p>`;
  return value ? `<p>${value}</p>` : null;
};

const getBooleanTextHtml = (answer) => {
  if (typeof answer !== 'object') return getValueText(answer);
  const elements = Object.values(answer).map((value) => {
    return getValueText(value);
  });
  return elements.join('');
};

const getAnswer = (id, sectionId, appealReply) => {
  // TODO: this check can be removed when the appealReply structure is flattened for all questions
  const answer =
    sectionId === 'aboutSiteSection' || id === 'originalPlanningApplicationPublicised'
      ? appealReply[id]
      : appealReply[sectionId]?.[id];
  if (!answer && typeof answer !== 'boolean') return { text: 'No answer found' };

  if (answer.uploadedFiles) {
    return { html: getFileListHtml(answer.uploadedFiles) };
  }

  // Assume default answer is radio with text of some kind
  return { html: getBooleanTextHtml(answer) };
};

/**
 * Creates create your answer sections for nunjucks component
 * @param {*} appealReply filled appeal reply
 * @param {*} appealId ID for url structure
 * @param {*} showActions Whether to show change action for each row
 * @returns array of grouped subtasks that are structured for nunjucks component
 */
module.exports = (appealReply, appealId, showActions = true) => {
  return SECTIONS.map(({ sectionId, tasks }) => {
    return {
      id: sectionId,
      heading: HEADERS[sectionId],
      subTasks: tasks.map(({ taskId, href }) => {
        const name = CHECK_ANSWERS[taskId] || HEADERS[taskId];
        return {
          key: { text: name },
          value: {
            ...getAnswer(taskId, sectionId, appealReply),
            classes: `test__${taskId}--answer`,
          },
          actions: showActions
            ? {
                items: [
                  {
                    href: `/${appealId}${href}`,
                    text: 'Change',
                    visuallyHiddenText: name,
                    attributes: {
                      'data-cy': taskId,
                    },
                  },
                ],
              }
            : undefined,
        };
      }),
    };
  });
};
