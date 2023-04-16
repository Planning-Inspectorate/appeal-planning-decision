const express = require('express');

const { getCodeExpired } = require('../../../controllers/common/code-expired');

const {
	VIEW: {
		FULL_APPEAL: { CODE_EXPIRED, ENTER_CODE }
	}
} = require('../../../lib/full-appeal/views');

const views = { CODE_EXPIRED, ENTER_CODE };

const router = express.Router();

router.get('/submit-appeal/code-expired', getCodeExpired(views));

module.exports = router;
