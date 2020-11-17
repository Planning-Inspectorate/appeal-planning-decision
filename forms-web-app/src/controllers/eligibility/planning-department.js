const { getLPAList } = require('../../lib/appeals-api-wrapper');

const PLANNING_DEPARTMENT = 'eligibility/planning-department';

/* Get planning department  */
exports.getPlanningDepartment = async (req, res) => {
  const { data: lpaList } = await getLPAList();

  const data = lpaList.map(({ name }) => name);

  res.render(PLANNING_DEPARTMENT, {
    data,
  });
};
