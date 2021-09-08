const express = require('express');
const authenticate = require('../middleware/authenticate');
const validateMagicLinkPayload = require('../middleware/validate-magiclink-payload');
const magicLinkController = require('../controllers/magiclink');

const router = express.Router();

router.post('/magiclink', validateMagicLinkPayload, magicLinkController.initiateMagicLinkFlow);
router.get('/magiclink/:magiclink', authenticate, magicLinkController.login);

module.exports = router;
