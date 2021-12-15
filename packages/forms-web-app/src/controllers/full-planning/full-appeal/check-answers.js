const { getDepartmentFromId } = require('../../../services/department.service');
const { VIEW } = require('../../../lib/full-planning/views');

exports.getCheckAnswers = async (req, res) => {
  const { appeal } = req.session;
  let appealLPD = '';

  if (appeal.lpaCode) {
    const lpd = await getDepartmentFromId(appeal.lpaCode);
    if (lpd) {
      appealLPD = lpd.name;
    }
  }

  const options = {
    appealLPD,
    appeal,
  };

  res.render(VIEW.FULL_APPEAL.CHECK_ANSWERS, options);
};
