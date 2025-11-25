const express = require('express');
const cannotAppealEnforcement = require('../../controllers/before-you-start/cannot-appeal-enforcement');

const router = express.Router();

router.get('/cannot-appeal-enforcement', cannotAppealEnforcement.getCannotAppealEnforcement);

module.exports = router;
