const express = require('express');
const { usersGet, userPost, userGet, userDelete } = require('../controllers/user');
const router = express.Router();

router.get('/', usersGet);
router.post('/', userPost);
router.get('/:email', userGet);
router.delete('/:id', userDelete);

module.exports = router;
