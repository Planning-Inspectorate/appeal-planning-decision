const express = require('express');
const {
	getConfirmAddUser,
	postConfirmAddUser
} = require('../../controllers/lpa-dashboard/confirm-add-user');

const router = express.Router();

router.get('/confirm-add-user', getConfirmAddUser);
router.post('/confirm-add-user', postConfirmAddUser);

module.exports = router;
