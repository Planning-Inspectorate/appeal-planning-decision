const express = require('express');
const {
	usersGet,
	userGetById,
	userPost,
	userGet,
	userDelete,
	userSetStatus
} = require('../controllers/user');
const router = express.Router();

router.get('/', usersGet);
router.post('/', userPost);
router.get('/:id([a-f\\d]{24})', userGetById);
router.get('/:email', userGet);
router.delete('/:id', userDelete);
router.put('/:id/status', userSetStatus);
module.exports = router;
