const {
  VIEW: {
    APPELLANT_SUBMISSION: { CODE_EXPIRED, ENTER_CODE },
  },
} = require('../../lib/views');

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
