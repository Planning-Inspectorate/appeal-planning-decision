const express = require('express');

const { getCodeExpired } = require('../../controllers/common/code-expired');

const {
	VIEW: {
		FULL_APPEAL: { CODE_EXPIRED },
		FINAL_COMMENT: { INPUT_CODE }
	}
} = require('../../lib/views');

const views = { CODE_EXPIRED, ENTER_CODE: INPUT_CODE };

const router = express.Router();

router.get('/code-expired', getCodeExpired(views));

module.exports = router;
