const {
  VIEW: {
    FULL_APPEAL: { CODE_EXPIRED, ENTER_CODE },
  },
} = require('../../../lib/full-appeal/views');

const getCodeExpired = (req, res) => {
		res.render(CODE_EXPIRED);
};

const postCodeExpired = async (req, res) => {
    return res.redirect(`/${ENTER_CODE}`);
};

module.exports = {
  getCodeExpired,
  postCodeExpired,
};
