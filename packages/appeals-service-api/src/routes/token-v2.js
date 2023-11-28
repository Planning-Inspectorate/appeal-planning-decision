const express = require('express');

const { tokenPutV2, tokenPostV2 } = require('../controllers/token');

const router = express.Router();

router.put('/', tokenPutV2);
router.post('/', tokenPostV2);

module.exports = router;
