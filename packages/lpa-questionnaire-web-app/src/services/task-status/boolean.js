const { booleanQuestions } = require('../../lib/questionTypes');
const { COMPLETED, NOT_STARTED } = require('./task-statuses');

module.exports = (appealReply, taskId) => {
  if (!appealReply) return null;

  const task = appealReply[taskId];
  const { dataId, text } = booleanQuestions.find((q) => q.id === taskId);
  let completed;
  if (text) {
    const id = dataId || 'value';
    if (typeof task === 'undefined') {
      completed = false;
    } else {
      completed =
        (typeof task[id] === 'boolean' && task[id] !== text.parentValue) ||
        (task[id] === text.parentValue && task[text.id]);
    }
  } else {
    completed = typeof task === 'boolean';
  }

  return completed ? COMPLETED : NOT_STARTED;
};
