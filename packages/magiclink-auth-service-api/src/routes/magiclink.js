const express = require('express');
const authenticate = require('../middleware/authenticate');
const validateMagicLinkPayload = require('../middleware/validate-magiclink-payload');
const magicLinkController = require('../controllers/magiclink');
const router = express.Router();

router.post('/magiclink', validateMagicLinkPayload, magicLinkController.create);
router.get('/magiclink/:magiclink', authenticate, magicLinkController.login);

router.get('/hello', (req, res) => {
  return res.status(200).send('Hello world');
});

module.exports = router;
