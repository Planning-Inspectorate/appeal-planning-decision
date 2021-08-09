const express = require('express');
const getDataFromMagicLinkJWT = require('../middleware/get-magiclink-jwt-data');
const magicLinkController = require('../controllers/magiclink');

const router = express.Router();

router.get('/magiclink/:magiclink', getDataFromMagicLinkJWT, magicLinkController.login);

module.exports = router;
