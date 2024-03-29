const express = require('express');
const useADifferentServiceController = require('../../controllers/full-appeal/use-a-different-service');

const router = express.Router();

router.get('/use-a-different-service', useADifferentServiceController.getUseADifferentService);

module.exports = router;
