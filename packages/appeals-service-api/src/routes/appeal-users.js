const express = require('express');
const { userGet } = require('../controllers/user');
const { userPost } = require('../controllers/appeal-user');
const router = express.Router();

router.get('/:email', userGet);
router.post('/', userPost);
module.exports = router;
