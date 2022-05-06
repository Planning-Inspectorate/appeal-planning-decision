const express = require('express');
const canUseService = require('../../controllers/before-you-start/can-use-service');
const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');

const router = express.Router();

router.get('/can-use-service', [fetchExistingAppealMiddleware], canUseService.getCanUseService);

module.exports = router;
