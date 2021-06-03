const { VIEW } = require('../../lib/views');
const getAppealSideBarDetails = require('../../lib/appeal-sidebar-details');
const { createOrUpdateAppealReply } = require('../../lib/appeal-reply-api-wrapper');

exports.BOOLEAN_VIEW = 'question-type/boolean';

exports.getBooleanQuestion = (req, res) => {
  const { id, dataId, text } = res.locals.question;

  const booleanInput = req.session.appealReply[id];

  let values = {};

  if (booleanInput && typeof booleanInput === 'object') {
    values = {
      booleanInput: dataId ? booleanInput[dataId] : booleanInput.value,
      booleanInputText: booleanInput[text.id],
    };
  } else {
    values = { booleanInput };
  }

  res.render(this.BOOLEAN_VIEW, {
    appeal: getAppealSideBarDetails(req.session.appeal),
    backLink: req.session.backLink || `/${req.params.id}/${VIEW.TASK_LIST}`,
    values,
    question: res.locals.question,
  });
};

exports.postBooleanQuestion = async (req, res) => {
  const { id, dataId, text } = res.locals.question;
  const {
    body: { errors = {}, errorSummary = [], booleanInput = null, booleanInputText = '' },
    session: { appealReply },
  } = req;

  const values = { booleanInput, booleanInputText };

  try {
    if (Object.keys(errors).length > 0) throw new Error('Validation failed');

    if (typeof booleanInput === 'string') {
      if (text) {
        appealReply[id][text.id] = booleanInputText;
        appealReply[id][dataId || 'value'] = booleanInput === 'yes';
      } else {
        appealReply[id] = booleanInput === 'yes';
      }

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
      question: res.locals.question,
    });

    return;
  }

  res.redirect(req.session.backLink || `/${req.params.id}/${VIEW.TASK_LIST}`);
};
