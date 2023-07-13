const express = require('express');
const {
	getConfirmRemoveUser,
	postConfirmRemoveUser
} = require('../../controllers/lpa-dashboard/confirm-remove-user');

const router = express.Router();

router.get('/confirm-remove-user/:id', getConfirmRemoveUser);
router.post('/confirm-remove-user/:id', postConfirmRemoveUser);

module.exports = router;
