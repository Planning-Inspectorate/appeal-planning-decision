const express = require('express');
const {
	getEmailAddress,
	postEmailAddress
} = require('../../controllers/lpa-dashboard/email-address');

const router = express.Router();

router.get('/email-address', getEmailAddress);
router.post('/email-address', postEmailAddress);

module.exports = router;
