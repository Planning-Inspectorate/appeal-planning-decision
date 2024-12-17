//todo: legacy validator - can probably be removed

const { body } = require('express-validator');
const { getDepartmentData } = require('../../services/department.service');

const validateDepartment = async (department) => {
	const { departments, eligibleDepartments } = await getDepartmentData();

	if (!departments.includes(department)) {
		throw new Error('Select the local planning department from the list');
	}

	if (!eligibleDepartments.includes(department)) {
		throw new Error('Ineligible Department');
	}

	return department;
};

const rules = () => {
	return [
		body('local-planning-department')
			.notEmpty()
			.withMessage('Select the local planning department from the list')
			.bail()
			.custom((value) => validateDepartment(value))
	];
};

module.exports = {
	rules
};
