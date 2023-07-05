const express = require('express');
const { getAddRemoveUsers } = require('../../controllers/lpa-dashboard/add-remove-users');

const router = express.Router();

router.get('/add-remove-users', getAddRemoveUsers);

module.exports = router;
