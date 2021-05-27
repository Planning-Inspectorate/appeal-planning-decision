const { COMPLETED, NOT_STARTED } = require('./task-statuses');

module.exports = (appealReply, taskId) => {
  if (!appealReply) return null;

  const task = appealReply[taskId];

  return typeof task === 'boolean' ? COMPLETED : NOT_STARTED;
};
