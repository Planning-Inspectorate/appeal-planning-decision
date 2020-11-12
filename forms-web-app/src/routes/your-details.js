const express = require('express');
const fetchExistingAppealMiddleware = require('../middleware/fetch-existing-appeal');
const yourDetailsController = require('../controllers/your-details');
const { rules: yourDetailsRules } = require('./validators/your-details');
const { validator } = require('./validators/validator');

const router = express.Router();

router.get('/', [fetchExistingAppealMiddleware], yourDetailsController.getYourDetails);
router.post('/', [yourDetailsRules(), validator], yourDetailsController.postYourDetails);

module.exports = router;
