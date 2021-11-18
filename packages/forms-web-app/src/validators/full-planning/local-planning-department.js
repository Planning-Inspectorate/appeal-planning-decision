const { body } = require('express-validator');
const { getDepartmentData } = require('../../services/department.service');

const validateDepartment = async (department) => {
  const { departments, eligibleDepartments } = await getDepartmentData();

  if (!departments.includes(department)) {
    throw new Error('Which local planning department dealt with your planning application?');
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
      .withMessage('Which local planning department dealt with your planning application?')
      .bail()
      .custom((value) => validateDepartment(value)),
  ];
};

module.exports = {
  rules,
};
