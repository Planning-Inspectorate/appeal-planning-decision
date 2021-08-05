const express = require('express');
const magicLinkAuth = require('../middleware/magiclink-auth');

const router = express.Router();

router.get('/magiclink/:magiclink', magicLinkAuth);

module.exports = router;
