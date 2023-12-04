const express = require('express');
const { userGet, userPost } = require('./controller');
const router = express.Router();

router.get('/:email', userGet);
router.post('/', userPost);

module.exports = { router };
