const express = require('express');
const { getConfirmAddUser } = require('../../controllers/lpa-dashboard/confirm-add-user');

const router = express.Router();

router.get('/confirm-add-user', getConfirmAddUser);

module.exports = router;
