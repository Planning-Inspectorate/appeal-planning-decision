const { VIEW } = require('../../lib/views');
const getAppealSideBarDetails = require('../../lib/appeal-sidebar-details');
const { createOrUpdateAppealReply } = require('../../lib/appeal-reply-api-wrapper');

exports.BOOLEAN_VIEW = 'question-type/boolean';

exports.getBooleanQuestion = (req, res) => {
  const { id, heading, section, title } = res.locals.questionInfo;

  const booleanInput = req.session.appealReply[id];

  const values = {
    booleanInput,
  };

  res.render(this.BOOLEAN_VIEW, {
    appeal: getAppealSideBarDetails(req.session.appeal),
    backLink: req.session.backLink || `/${req.params.id}/${VIEW.TASK_LIST}`,
    values,
    page: {
      heading,
      section,
      title,
    },
  });
};

exports.postBooleanQuestion = async (req, res) => {
  const { id, heading, section, title } = res.locals.questionInfo;
  const {
    body: { errors = {}, errorSummary = [], booleanInput = null },
    session: { appealReply },
  } = req;

  const values = { booleanInput };
  const page = {
    heading,
    section,
    title,
  };

  try {
    if (Object.keys(errors).length > 0) throw new Error('Validation failed');

    if (typeof booleanInput === 'string') {
      appealReply[id] = booleanInput === 'yes';
      req.session.appealReply = await createOrUpdateAppealReply(appealReply);
    }
  } catch (err) {
    if (err.toString() !== 'Error: Validation failed')
      req.log.error({ err }, 'Error creating or updating appeal');

    res.render(this.BOOLEAN_VIEW, {
      appeal: getAppealSideBarDetails(req.session.appeal),
      backLink: req.session.backLink || `/${req.params.id}/${VIEW.TASK_LIST}`,
      errors,
      errorSummary: errorSummary.length ? errorSummary : [{ text: err.toString() }],
      values,
      page,
    });

    return;
  }

  res.redirect(req.session.backLink || `/${req.params.id}/${VIEW.TASK_LIST}`);
};
