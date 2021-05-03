const { VIEW } = require('./views');
const { createOrUpdateAppeal } = require('./appeals-api-wrapper');
const logger = require('./logger');

const expiryDecisionDateErrTxt = 'Cannot update or submit appeal with passed decision date';

exports.expiryDecisionDateErrTxt = expiryDecisionDateErrTxt;

exports.createdOrUpdatedAppealHandler = async ({ req, res, createOrUpdateAppealErrHandler }) => {
  let result = true;

  try {
    req.session.appeal = await createOrUpdateAppeal(req.session.appeal);
  } catch (e) {
    result = false;
    logger.error(e);

    if (e.message === expiryDecisionDateErrTxt) {
      req.session.expiredDecisionDate = req.session.appeal.decisionDate;
      res.redirect(`/${VIEW.ELIGIBILITY.DECISION_DATE_PASSED}`);
    } else if (createOrUpdateAppealErrHandler) {
      createOrUpdateAppealErrHandler(e);
    }
  }

  return result;
};
