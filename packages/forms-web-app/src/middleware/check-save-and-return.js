const { saveAppeal } = require('../lib/appeals-api-wrapper');
const {
  VIEW: {
    SUBMIT_APPEAL: { APPLICATION_SAVED },
  },
} = require('../lib/submit-appeal/views');
const logger = require('../lib/logger');

const checkSaveAndReturn = async (req, res, next) => {
  const { body, session: { appeal } = {} } = req;
  const isSaveAndReturn = body['save-and-return'] !== undefined;

  if (isSaveAndReturn) {
    try {
      await saveAppeal(appeal);
      return res.redirect(`/${APPLICATION_SAVED}`);
    } catch (e) {
      logger.error(e);
    }
  }

  return next();
};

module.exports = checkSaveAndReturn;
