const VIEW = {
  NO_DECISION: 'eligibility/no-decision',
  DECISION_DATE: 'eligibility/decision-date',
  DECISION_DATE_EXPIRED: 'eligibility/decision-date-expired',
  PLANNING_DEPARTMENT: 'eligibility/planning-department',
  PLANNING_DEPARTMENT_OUT: 'eligibility/planning-department-out',
};

const { getLPAList } = require('../../lib/appeals-api-wrapper');

const eligibleDepartment = [];
let departmentList = [];

// TODO validator
// TODO planning-department-out dynamically
const getDepartmentList = async () => {
  if (departmentList.length === 0) {
    const { data: lpaList } = await getLPAList();
    departmentList = lpaList.map((department) => {
      if (department.inTrial) {
        eligibleDepartment.push(department.name);
      }
      return department.name;
    });
  }
  return departmentList;
};

const getEligibleDepartmentList = () => {
  return eligibleDepartment;
};

/* Get planning department  */
exports.getPlanningDepartment = async (req, res) => {
  const data = await getDepartmentList();

  res.render(VIEW.PLANNING_DEPARTMENT, {
    data,
  });
};

exports.postPlanningDepartment = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;

  const data = await getDepartmentList();

  if (Object.keys(errors).length > 0) {
    res.render(VIEW.PLANNING_DEPARTMENT, { data, errors, errorSummary });
    return;
  }

  const department = body['local-planning-department'];
  if (getEligibleDepartmentList().includes(department)) {
    res.redirect('/eligibility/listed-building');
  } else {
    res.render(VIEW.PLANNING_DEPARTMENT_OUT);
  }
};

exports.getPlanningDepartmentOut = (req, res) => {
  res.render(VIEW.PLANNING_DEPARTMENT_OUT);
};
