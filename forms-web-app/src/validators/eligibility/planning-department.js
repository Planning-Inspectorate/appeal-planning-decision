const { body } = require('express-validator');
const { getDepartmentData } = require('../../services/service');

const validateEligibility = async (department) => {
  const { eligibleDepartments } = await getDepartmentData();

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
      .custom((value) => validateEligibility(value)),
  ];
};

module.exports = {
  rules,
};
