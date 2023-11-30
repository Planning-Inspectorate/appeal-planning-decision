const express = require('express');

const { tokenPutV2, tokenPostV2 } = require('../controllers/token');
const asyncHandler = require('../middleware/async-handler');

const router = express.Router();

router.put('/', asyncHandler(tokenPutV2));
router.post('/', asyncHandler(tokenPostV2));

module.exports = router;
