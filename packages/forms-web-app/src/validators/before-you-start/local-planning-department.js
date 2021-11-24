const { body } = require('express-validator');
const { getDepartmentData } = require('../../services/department.service');

const validateDepartment = async (department) => {
  const { departments, eligibleDepartments } = await getDepartmentData();

  if (!departments.includes(department)) {
    throw new Error('Enter the name of the local planning department');
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
      .withMessage('Enter the name of the local planning department')
      .bail()
      .custom((value) => validateDepartment(value)),
  ];
};

module.exports = {
  rules,
};
