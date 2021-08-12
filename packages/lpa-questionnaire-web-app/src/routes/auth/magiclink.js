const express = require('express');
const authenticateMagicLink = require('../../middleware/authenticate-magiclink');
const magicLinkController = require('../../controllers/magiclink');

const router = express.Router();

router.get('/magiclink/:magiclink', authenticateMagicLink, magicLinkController.login);

module.exports = router;
