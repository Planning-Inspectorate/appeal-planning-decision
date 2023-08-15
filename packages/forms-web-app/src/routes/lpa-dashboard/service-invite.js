const express = require('express');
const { getServiceInvite } = require('../../../src/controllers/lpa-dashboard/service-invite');

const router = express.Router();

router.get('/service-invite/:lpaCode', getServiceInvite);

module.exports = router;
