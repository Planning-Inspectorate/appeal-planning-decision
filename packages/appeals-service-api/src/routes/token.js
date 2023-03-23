const express = require('express');

const { tokenPut, tokenPost } = require('../controllers/token');

const router = express.Router();

router.put('/', tokenPut);
router.post('/', tokenPost);

module.exports = router;
