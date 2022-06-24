const { sendToken } = require('../../../lib/appeals-api-wrapper');
const { VIEW } = require('../../../lib/submit-appeal/views');

const getEnterCode = async (req, res) => {
  const { appeal } = req.session.appeal;
  await sendToken(appeal);
  res.render(VIEW.SUBMIT_APPEAL.ENTER_CODE);
};

module.exports = {
  getEnterCode,
};
