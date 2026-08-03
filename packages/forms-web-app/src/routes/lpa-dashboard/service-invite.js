const express = require('express');
const { getServiceInvite } = require('../../controllers/lpa-dashboard/service-invite');

const router = express.Router();

router.get('/service-invite/:lpaCode', getServiceInvite);

module.exports = router;
