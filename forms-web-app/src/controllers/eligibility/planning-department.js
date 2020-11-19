const { getDepartmentData } = require('../../services/service');
const { VIEW } = require('../../lib/views');

exports.getPlanningDepartment = async (req, res) => {
  const { departments } = await getDepartmentData();

  res.render(VIEW.PLANNING_DEPARTMENT, {
    departments,
  });
};

exports.postPlanningDepartment = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;

  if (errors['local-planning-department']) {
    const errorMessage = errors['local-planning-department'].msg;
    const { departments, eligibleDepartments } = await getDepartmentData();

    if (errorMessage === 'Ineligible Department') {
      res.render(VIEW.PLANNING_DEPARTMENT_OUT, eligibleDepartments);
    } else {
      res.render(VIEW.PLANNING_DEPARTMENT, { departments, errors, errorSummary });
    }
    return;
  }

  res.redirect('/eligibility/listed-building');
};

exports.getPlanningDepartmentOut = (req, res) => {
  res.render(VIEW.PLANNING_DEPARTMENT_OUT);
};
