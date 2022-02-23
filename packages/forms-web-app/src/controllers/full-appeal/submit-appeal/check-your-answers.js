const { getDepartmentFromId } = require('../../../services/department.service');
const { VIEW } = require('../../../lib/full-appeal/views');

const getCheckYourAnswers = async (req, res) => {
  const { appeal } = req.session;
  let appealLPD = '';

  if (appeal.lpaCode) {
    const lpd = await getDepartmentFromId(appeal.lpaCode);
    if (lpd) {
      appealLPD = lpd.name;
    }
  }

  res.render(VIEW.FULL_APPEAL.CHECK_YOUR_ANSWERS, {
    appealLPD,
    appeal,
  });
};

module.exports = {
  getCheckYourAnswers,
};
