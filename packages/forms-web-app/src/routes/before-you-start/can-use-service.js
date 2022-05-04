const express = require('express');
const canUseService = require('../../controllers/before-you-start/can-use-service');

const router = express.Router();

router.get('/can-use-service', canUseService.getCanUseService);

module.exports = router;
