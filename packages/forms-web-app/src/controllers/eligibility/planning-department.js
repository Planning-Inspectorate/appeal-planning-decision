const logger = require('../../lib/logger');
const { getDepartmentFromName } = require('../../services/department.service');
const { getDepartmentFromId } = require('../../services/department.service');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const { getDepartmentData } = require('../../services/department.service');
const { VIEW } = require('../../lib/views');

exports.getPlanningDepartment = async (req, res) => {
  const { departments, eligibleDepartments, ineligibleDepartments } = await getDepartmentData();
  const { appeal } = req.session;
  let appealLPD = '';
  if (appeal.lpaCode) {
    const lpd = await getDepartmentFromId(appeal.lpaCode);
    if (lpd) {
      appealLPD = lpd.name;
    }
  }
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
  const { departments } = await getDepartmentData();

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
    res.render(VIEW.ELIGIBILITY.PLANNING_DEPARTMENT_OUT);
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
