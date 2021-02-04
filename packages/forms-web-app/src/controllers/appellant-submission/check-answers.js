const { getDepartmentFromId } = require('../../services/department.service');
const { VIEW } = require('../../lib/views');
const logger = require('../../lib/logger');

exports.getCheckAnswers = async (req, res) => {
  const { appeal } = req.session;

logger.info( appeal );

  let appealLPD = '';

  if (appeal.lpaCode) {
    const lpd = await getDepartmentFromId(appeal.lpaCode);
    if (lpd) {
      appealLPD = lpd.name;
    }
  }

  res.render(VIEW.APPELLANT_SUBMISSION.CHECK_ANSWERS, {
    appealLPD,
    appeal,
  });
};
