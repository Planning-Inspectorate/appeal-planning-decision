const express = require('express');

const { getCodeExpired } = require('../../controllers/common/code-expired');

const {
	VIEW: {
		APPELLANT_SUBMISSION: { CODE_EXPIRED, ENTER_CODE }
	}
} = require('../../lib/views');

const views = { CODE_EXPIRED, ENTER_CODE };

const router = express.Router();

router.get('/code-expired', getCodeExpired(views));

module.exports = router;
