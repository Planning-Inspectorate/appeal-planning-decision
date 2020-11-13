const express = require('express');

const planningDepartmentController = require('../../controllers/eligibility/planning-department');

const router = express.Router();

router.get('/planning-department', planningDepartmentController.getPlanningDepartment);

module.exports = router;
