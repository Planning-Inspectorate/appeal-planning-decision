const express = require('express');
const {
	getCannotAppealEnforcement
} = require('../../controllers/before-you-start/cannot-appeal-enforcement');

const router = express.Router();

router.get('/cannot-appeal-enforcement', getCannotAppealEnforcement);

module.exports = router;
