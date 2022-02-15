const logger = require('../../lib/logger');
const {
  VIEW: { PROCEDURE_TYPE: currentPage, TASK_LIST: taskListPage },
} = require('../../lib/full-appeal/views');
const { getTaskStatus } = require('../../services/task.service');
const { createOrUpdateAppealReply } = require('../../lib/appeal-reply-api-wrapper');

const sectionName = 'procedureTypeReview';
const taskName = 'procedureType';

exports.getProcedureType = async (req, res) => {
  // Line 13 needs editing to correctly fetch the procedure type from the data object
  const procedureType = '';
  res.render(currentPage, {
    procedureType,
    backLink: taskListPage,
  });
};

exports.postProcedureType = async (req, res) => {
  const {
    body,
    session: { appealReply },
  } = req;
  const { errors = {}, errorSummary = [] } = body;

  // This function needs editing to correctly save data to the existing data

  const procedureType = body['procedure-type'];

  if (Object.keys(errors).length > 0) {
    return res.render(currentPage, {
      procedureType,
      errors,
      errorSummary,
      backLink: taskListPage,
    });
  }

  // const task = appealReply[sectionName][taskName];
  // task.procedureType = procedureType;
  // appealReply.sectionStates[sectionName][taskName] = getTaskStatus(
  //   appealReply,
  //   sectionName,
  //   taskName
  // );

  try {
    req.session.appeal = await createOrUpdateAppealReply(appealReply);
  } catch (e) {
    logger.error(e);

    return res.render(currentPage, {
      procedureType,
      errors,
      errorSummary: [{ text: e.toString(), href: '#' }],
      backLink: taskListPage,
    });
  }

  return res.redirect(taskListPage);
};
