const logger = require('../../lib/logger');
const { getDepartmentFromName } = require('../../services/department.service');
const { getDepartmentFromId } = require('../../services/department.service');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const { getDepartmentData } = require('../../services/department.service');
const { VIEW } = require('../../lib/views');

exports.getPlanningDepartment = async (req, res) => {
  const { departments, eligibleDepartments } = await getDepartmentData();
  const { appeal } = req.session;
  let appealLPD = '';
  if (appeal.lpaCode) {
    const lpd = await getDepartmentFromId(appeal.lpaCode);
    if (lpd) {
      appealLPD = lpd.name;
    }
  }
  const ineligibleDepartments = departments.filter((x) => !eligibleDepartments.includes(x));
  res.render(VIEW.ELIGIBILITY.PLANNING_DEPARTMENT, {
    appealLPD,
    departments,
    eligibleDepartments,
    ineligibleDepartments,
  });
};

exports.postPlanningDepartment = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;
  const { appeal } = req.session;
  const { departments, eligibleDepartments } = await getDepartmentData();

  if (errors['local-planning-department']) {
    const errorMessage = errors['local-planning-department'].msg;

    if (errorMessage !== 'Ineligible Department') {
      res.render(VIEW.ELIGIBILITY.PLANNING_DEPARTMENT, {
        appealLPD: '',
        departments,
        errors,
        errorSummary,
      });
      return;
    }
    let formattedDepartments = eligibleDepartments;
    if (eligibleDepartments.length > 1) {
      formattedDepartments = eligibleDepartments.join(', ');
      const lastDept = eligibleDepartments[eligibleDepartments.length - 1];
      formattedDepartments = formattedDepartments.replace(`, ${lastDept}`, ` and ${lastDept}`);
    }
    const data = {
      departments: formattedDepartments,
    };
    res.render(VIEW.ELIGIBILITY.PLANNING_DEPARTMENT_OUT, data);
  }

  const lpaName = body['local-planning-department'];
  const lpa = await getDepartmentFromName(lpaName);

  appeal.lpaCode = lpa.id;
  try {
    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (e) {
    logger.error(e);

    res.render(VIEW.ELIGIBILITY.PLANNING_DEPARTMENT, {
      appeal,
      errors,
      errorSummary: [{ text: e.toString(), href: '#' }],
    });
    return;
  }

  if (!errors['local-planning-department']) {
    res.redirect(`/${VIEW.ELIGIBILITY.LISTED_BUILDING}`);
  }
};

exports.getPlanningDepartmentOut = (req, res) => {
  res.render(VIEW.ELIGIBILITY.PLANNING_DEPARTMENT_OUT);
};
