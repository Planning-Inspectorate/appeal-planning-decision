const express = require('express');
const router = express.Router();

router.use(require('./planning-application-number'));
router.use(require('./email-address'));
router.use(require('./email-address-confirmed'));
router.use(require('./confirm-email-address'));
router.use(require('./list-of-documents'));
router.use(require('./application-saved'));

module.exports = router;
