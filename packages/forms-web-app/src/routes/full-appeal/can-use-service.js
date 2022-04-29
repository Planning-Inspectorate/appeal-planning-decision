const express = require('express');
const canUseService = require('../../controllers/householder-planning/eligibility/can-use-service');

const router = express.Router();

router.get('/can-use-service', canUseService.getCanUseService);

module.exports = router;
