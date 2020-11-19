const { getLPAList } = require('../lib/appeals-api-wrapper');

// If the final department list takes too long,
// it will be better to keep lists in memory and update it regularly
const getDepartmentData = async () => {
  const { data } = await getLPAList();

  const eligibleDepartments = [];
  const departments = data.map((department) => {
    if (department.inTrial) {
      eligibleDepartments.push(department.name);
    }
    return department.name;
  });

  return { departments, eligibleDepartments };
};

module.exports = {
  getDepartmentData,
};
