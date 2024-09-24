const express = require('express');
const router = express.Router();

router.use(require('./email-address'));
router.use(require('./enter-code'));
router.use(require('./request-new-code'));
router.use(require('./code-expired'));

module.exports = router;
