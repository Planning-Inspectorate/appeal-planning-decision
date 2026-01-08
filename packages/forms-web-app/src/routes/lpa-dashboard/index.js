const express = require('express');
const router = express.Router();

const requireLpaUser = require('#middleware/lpa-dashboard/require-user');

// login
router.use(require('./service-invite'));
router.use(require('./enter-code'));
router.use(require('./request-new-code'));
router.use(require('./need-new-code'));
router.use(require('./code-expired'));
router.use(require('./your-email-address'));

// require user for subsequent routes
router.use(requireLpaUser);

// appeals
router.get('/', (_, res) => res.redirect('/manage-appeals/your-appeals'));
router.use(require('./your-appeals'));
router.use(require('./questionnaire'));
router.use(require('./decided-appeals'));
router.use(require('./withdrawn-appeals'));
router.use(require('./statement'));
router.use(require('./final-comments'));
router.use(require('./proof-evidence'));

// manage users
router.use(require('./add-remove-users'));
router.use(require('./email-address'));
router.use(require('./confirm-add-user'));
router.use(require('./confirm-remove-user'));

// todo: leave at end or fix the urls defined in these routes, currently catches anything else as :appealNumber
router.use(require('./selected-appeal'));

module.exports = router;
