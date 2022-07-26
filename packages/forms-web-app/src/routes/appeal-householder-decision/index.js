const express = require('express');
const router = express.Router();

router.use(require('./task-list'));
router.use(require('./planning-application-number'));
router.use(require('./email-address'));
router.use(require('./email-address-confirmed'));
router.use(require('./confirm-email-address'));
router.use(require('./list-of-documents'));
router.use(require('./application-saved'));
router.use(require('./save'));
router.use(require('./enter-code'));
router.use(require('./request-new-code'));
router.use(require('./cannot-appeal'));
router.use(require('./link-expired'));
router.use(require('./code-expired'));
router.use(require('./sent-another-link'));

module.exports = router;
