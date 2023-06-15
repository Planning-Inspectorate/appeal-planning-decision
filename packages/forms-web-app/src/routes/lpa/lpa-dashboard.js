const express = require('express');
const router = express.Router();

const {
	VIEW: {
		LPA: { DASHBOARD }
	}
} = require('../../lib/views');

router.get('/lpa-dashboard', function (req, res) {
	res.status(200);
	return res.render(DASHBOARD);
});

module.exports = router;
