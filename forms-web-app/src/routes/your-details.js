const express = require('express');
const fetchExistingAppealMiddleware = require('../middleware/fetch-existing-appeal');

const yourDetailsController = require('../controllers/your-details');

const router = express.Router();

router.get('/', [fetchExistingAppealMiddleware], yourDetailsController.getYourDetails);
router.post('/', yourDetailsController.postYourDetails);

module.exports = router;
